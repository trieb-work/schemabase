import { ILogger } from "@eci/pkg/logger";
import { Job } from "bullmq";

export interface Workflow {
    run: () => Promise<void>;
}

export type RuntimeContext = {
    logger: ILogger;
    job: Job;
};

export type WorkflowFactory = {
    /**
     * Convenience field used in the scheduler
     */
    name: string;

    /**
     * Inject the runtimeContext and create the workflow instance
     */
    build: (ctx: RuntimeContext) => Workflow;
};

/**
 * Create a new workflow factory to allow inejcting the runtimeContext later
 */
export function createWorkflowFactory<
    TWorkflow extends {
        new (...args: any): Workflow;
    },
>(
    WorkflowClass: TWorkflow,
    clients: ConstructorParameters<TWorkflow>[1],
    config?: ConstructorParameters<TWorkflow>[2],
): WorkflowFactory {
    return {
        name: WorkflowClass.name,
        build: (ctx: RuntimeContext) => new WorkflowClass(ctx, clients, config),
    };
}
