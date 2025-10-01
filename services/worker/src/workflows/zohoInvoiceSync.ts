import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoInvoiceSyncService } from "@eci/pkg/integration-zoho-entities/src/invoices";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoInvoiceSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type ZohoInvoiceSyncWorkflowConfig = {
    zohoAppId: string;
};

export class ZohoInvoiceSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private zohoAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: ZohoInvoiceSyncWorkflowClients,
        config: ZohoInvoiceSyncWorkflowConfig,
    ) {
        this.zohoAppId = config.zohoAppId;
        this.logger = ctx.logger.with({
            workflow: ZohoInvoiceSyncWf.name,
            zohoAppId: this.zohoAppId,
        });
        this.prisma = clients.prisma;
    }

    /**
     * Sync all zoho invoices into ECI-DB
     */
    public async run(): Promise<void> {
        this.logger.info("Starting zoho invoice sync workflow run");
        const { client: zoho, zohoApp } = await getZohoClientAndEntry(
            this.zohoAppId,
            this.prisma,
            undefined,
        );
        const zohoInvoiceSyncService = new ZohoInvoiceSyncService({
            logger: this.logger,
            zoho,
            db: this.prisma,
            zohoApp: zohoApp,
            createdTimeOffset: 20,
        });
        await zohoInvoiceSyncService.syncToECI();
        /**
         * auto-create invoices from SalesOrders
         */
        await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();

        this.logger.info("Finished zoho invoice sync workflow run");
    }
}
