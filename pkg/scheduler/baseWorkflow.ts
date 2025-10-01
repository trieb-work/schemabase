import { ILogger } from "@eci/pkg/logger";
import { RuntimeContext, Workflow } from "./workflow";

/**
 * Base workflow class that automatically sets up logger with workflow name metadata.
 * This ensures consistent logging across all workflows.
 */
export abstract class BaseWorkflow implements Workflow {
    protected logger: ILogger;

    constructor(
        ctx: RuntimeContext,
        workflowName: string,
        additionalMetadata: Record<string, any> = {},
    ) {
        this.logger = ctx.logger.with({
            workflow: workflowName,
            ...additionalMetadata,
        });
    }

    abstract run(): Promise<void>;
}

/**
 * Utility function to create logger with workflow metadata.
 * Use this if you prefer composition over inheritance.
 */
export function createWorkflowLogger(
    ctx: RuntimeContext,
    workflowName: string,
    additionalMetadata: Record<string, any> = {},
): ILogger {
    return ctx.logger.with({
        workflow: workflowName,
        ...additionalMetadata,
    });
}
