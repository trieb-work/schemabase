import { Job, Queue, Worker, RepeatOptions } from "bullmq";
import { env } from "@eci/pkg/env";
import { ILogger } from "@eci/pkg/logger";
import { WorkflowFactory } from "./workflow";
export type RedisConnection = {
    host: string;
    port: number;
    password: string;
};

export type WorkflowSchedulerConfig = {
    logger: ILogger;
    redisConnection: RedisConnection;
};

const SCHEDULE_SPECIFIC_WORKFLOWS = env
    .get("SCHEDULE_SPECIFIC_WORKFLOWS", "")
    ?.split(",")
    .filter((s) => s !== "");

export class WorkflowScheduler {
    private readonly logger: ILogger;

    public readonly scheduledWorkflows: string[] = [];

    public readonly queues: Queue[] = [];

    public readonly jobs: Job[] = [];

    public readonly workers: Worker[] = [];
    // public readonly queueSchedulers: QueueScheduler[] = [];

    private readonly redisConnection: RedisConnection;

    constructor(config: WorkflowSchedulerConfig) {
        this.logger = config.logger;
        this.redisConnection = config.redisConnection;

        /**
         * Responsible for retrying failed jobs etc.
         */
    }

    public async schedule(
        workflow: WorkflowFactory,
        config: {
            attempts?: number;
            cron: string;
            /**
             * Time in seconds until the job is detected as stalled
             */
            timeout?: number;
            /**
             * Offset in minutes when the cronjob get's executet.
             */
            offset?: number;
        },
        queueNameGroups: (string | number)[] = [],
    ): Promise<void> {
        if (
            SCHEDULE_SPECIFIC_WORKFLOWS &&
            SCHEDULE_SPECIFIC_WORKFLOWS.length > 0 &&
            !SCHEDULE_SPECIFIC_WORKFLOWS.includes(workflow.name)
        ) {
            this.logger.warn("Skip scheduling of workflow", {
                workflow: workflow.name,
            });
            return;
        }

        const queueName = ["eci", ...queueNameGroups, workflow.name].join(":");
        if (this.scheduledWorkflows.includes(queueName)) {
            throw new Error("Workflow is already scheduled");
        }
        this.scheduledWorkflows.push(queueName);

        const repeat: RepeatOptions = {};
        if (env.get("ECI_ENV") === "development") {
            repeat.immediately = true;
            repeat.every = 1 * 60 * 60 * 1000; // 1h --> turn off repeat, only start once at boot
        } else {
            repeat.pattern = config.cron;
            repeat.tz = "Europe/Berlin";
            repeat.offset =
                (config?.offset ?? 0) + new Date().getTimezoneOffset();
        }

        this.logger.info("Scheduling new workflow", {
            queue: queueName,
            workflow: workflow.name,
            config,
            repeat,
        });

        const queue = new Queue(queueName, {
            connection: this.redisConnection,
        });
        this.queues.push(queue);
        this.jobs.push(
            await queue.add(workflow.name, "RUN", {
                jobId: queueName,
                repeat,
                attempts: config?.attempts ?? 1,
                keepLogs: 1000,
                backoff: {
                    type: "exponential",
                    delay: 60_000, // 1min, 2min, 4min...
                },
                removeOnComplete: {
                    count: env.get("ECI_ENV") === "production" ? 20 : 10,
                },
                removeOnFail: {
                    count: env.get("ECI_ENV") === "production" ? 20 : 10,
                },
            }),
        );

        /**
         * Process the job
         */
        this.workers.push(
            new Worker(
                queueName,
                async (job: Job) => {
                    // this is currently not working and is straming
                    // ALL logs into the job log, not just from the current workflow..
                    const logger = this.logger
                        .withLogDrain({
                            log: (message: string) => {
                                job.log(message);
                            },
                        })
                        .with({
                            jobId: job.id,
                            queueName,
                            workflow: workflow.name,
                        });

                    const runtimeContext = {
                        logger,
                        job,
                        redisConnection: this.redisConnection,
                    };
                    const wf = workflow.build(runtimeContext);
                    const before = Date.now();
                    await wf.run().catch((err) => {
                        if (err instanceof Error) {
                            logger.error(err.message, {
                                error: err.name,
                                stackTrace: err.stack,
                            });
                        }
                        /**
                         * Rethrowing to let bull know something went wrong
                         */
                        throw err;
                    });

                    logger.info("Job finished successfully", {
                        duration: Math.floor((Date.now() - before) / 1000),
                    });
                    job.updateProgress(100);
                },
                {
                    /**
                     * Set maximum duration after which a job is regarded as failed and retried
                     */
                    lockDuration: config.timeout
                        ? config.timeout * 1000
                        : undefined,
                    connection: this.redisConnection,
                    concurrency: 1,
                },
            ),
        );

        /**
         * Do the retry and scheduling magic
         */
        // this.queueSchedulers.push(
        //   new QueueScheduler(queueName, {
        //     connection: this.redisConnection,
        //   }),
        // );
    }

    public async shutdownScheduler() {
        await this.removeAllJobs();
        await this.shutdownAllWorkers();
        // await this.shutdownAllQueueSchedulers();
        await this.shutdownAllQueues();
    }

    public async shutdownAllWorkers() {
        for (const worker of this.workers) {
            this.logger.info("Shutting down worker", {
                workerName: worker.name,
            });
            await worker.close();
            await worker.disconnect();
            this.logger.info("Worker is offline", { workerName: worker.name });
        }
    }

    // public async shutdownAllQueueSchedulers() {
    //   for (const queueScheduler of this.queueSchedulers) {
    //     this.logger.info("Shutting down queuescheduler", {
    //       queueSchedulerName: queueScheduler.name,
    //     });
    //     await queueScheduler.close();
    //     await queueScheduler.disconnect();
    //     this.logger.info("queuescheduler is offline", {
    //       queueSchedulerName: queueScheduler.name,
    //     });
    //   }
    // }

    public async shutdownAllQueues() {
        for (const queue of this.queues) {
            this.logger.info("Shutting down queue", { queueName: queue.name });
            await queue.drain();
            await queue.close();
            await queue.disconnect();
            this.logger.info("queue is offline", { queueName: queue.name });
        }
    }

    public async removeAllJobs() {
        for (const job of this.jobs) {
            this.logger.info("Removing job", { jobName: job.name });
            try {
                await job.moveToFailed(new Error("canceled job"), "");
                await job.remove();
                this.logger.info("job is removed", { jobName: job.name });
            } catch (err) {
                this.logger.error("job is not removed", {
                    err,
                    jobName: job.name,
                });
            }
        }
    }
}
