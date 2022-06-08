import { ILogger } from "@eci/pkg/logger";

export interface Workflow {
  run: () => Promise<void>;
}

export type RuntimeContext = {
  logger: ILogger;
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
  workflowClass: TWorkflow,
  clients: ConstructorParameters<TWorkflow>[1],
  config?: ConstructorParameters<TWorkflow>[2],
): WorkflowFactory {
  return {
    name: workflowClass.name,
    build: (ctx: RuntimeContext) => new workflowClass(ctx, clients, config),
  };
}
