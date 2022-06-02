import { Job, Queue, Worker, QueueScheduler, RepeatOptions } from "bullmq";
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

const SCHEDULE_SPECIFIC_WORKFLOWS = env.get("SCHEDULE_SPECIFIC_WORKFLOWS", "")?.split(",").filter((s) => s !== "");

export class WorkflowScheduler {
  private readonly logger: ILogger;

  public readonly scheduledWorkflows: string[];

  private readonly redisConnection: RedisConnection;

  constructor(config: WorkflowSchedulerConfig) {
    this.logger = config.logger;
    this.scheduledWorkflows = [];
    this.redisConnection = config.redisConnection;

    /**
     * Responsible for retrying failed jobs etc.
     */
  }

  public schedule(
    workflow: WorkflowFactory,
    config: {
      attempts?: number;
      cron: string;
      /**
       * Time in seconds until the job is detected as stalled
       */
      timeout?: number;
    },
    queueNameGroups: (string | number)[] = [],
  ): void {
    if (
      SCHEDULE_SPECIFIC_WORKFLOWS && SCHEDULE_SPECIFIC_WORKFLOWS.length > 0 && !SCHEDULE_SPECIFIC_WORKFLOWS.includes(workflow.name)
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
    if (env.get("DWH_ENV") === "development") {
      repeat.immediately = true;
      repeat.every = 1 * 60 * 60 * 1000; // 1h --> turn off repeat, only start once at boot
    } else {
      repeat.cron = config.cron;
    }

    this.logger.info("Scheduling new workflow", {
      queue: queueName,
      workflow: workflow.name,
      config,
      repeat,
    });

    new Queue(queueName, { connection: this.redisConnection }).add(
      workflow.name,
      "RUN",
      {
        jobId: queueName,
        repeat,
        attempts: config?.attempts ?? 10,
        backoff: {
          type: "exponential",
          delay: 60_000, // 1min, 2min, 4min...
        },
        removeOnComplete: {
          count: env.get("DWH_ENV") === "production" ? 50 : 10,
        },
      },
    );

    /**
     * Process the job
     */
    new Worker(
      queueName,
      async (job: Job) => {
        const logger = this.logger
          .withLogDrain({
            log: (message: string) => {
              job.log(message);
            },
          })
          .with({ jobId: job.id, queueName });

        logger.info("Starting job");

        const runtimeContext = {
          logger,
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
        lockDuration: config.timeout ? config.timeout * 1000 : undefined,
        connection: this.redisConnection,
        concurrency: 1,
      },
    );

    /**
     * Do the retry and scheduling magic
     */
    new QueueScheduler(queueName, {
      connection: this.redisConnection,
    });
  }
}
