import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
// eslint-disable-next-line max-len
import { BraintreeTransactionSyncService } from "@eci/pkg/integration-braintree-entities/src/transactions";
import { getBraintreeClientAndEntry } from "@eci/pkg/braintree/src/getClientAndEntry";

export type BraintreeTransactionSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type BraintreeTransactionSyncWorkflowConfig = {
    braintreeAppId: string;
};

export class BraintreeTransactionSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private braintreeAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: BraintreeTransactionSyncWorkflowClients,
        config: BraintreeTransactionSyncWorkflowConfig,
    ) {
        this.logger = ctx.logger.with({
            workflow: BraintreeTransactionSyncWf.name,
            braintreeAppId: config.braintreeAppId,
        });
        this.prisma = clients.prisma;
        this.braintreeAppId = config.braintreeAppId;
    }

    /**
     * Start the sync of braintree transactions into the ECI db
     */
    public async run(): Promise<void> {
        this.logger.info("Starting braintree transaction sync workflow run");
        const { braintreeClient, braintreeApp } =
            await getBraintreeClientAndEntry(this.braintreeAppId, this.prisma);

        const braintreeTransactionSync = new BraintreeTransactionSyncService({
            logger: this.logger,
            braintreeClient,
            db: this.prisma,
            tenantId: braintreeApp.tenantId,
            braintreeAppId: this.braintreeAppId,
        });
        await braintreeTransactionSync.syncToECI();
        this.logger.info("Finished braintree transaction sync workflow run");
    }
}
