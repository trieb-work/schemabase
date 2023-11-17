import type { ILogger } from "@eci/pkg/logger";
import type { AWSCognitoApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
// eslint-disable-next-line max-len
import { CognitoUserSyncService } from "@eci/pkg/integration-aws-cognito/src/users";

export type CognitoUserSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type CognitoUserSyncWorkflowConfig = {
    awsCognitoApp: AWSCognitoApp;
};

export class CognitoUserSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private awsCognitoApp: AWSCognitoApp;

    public constructor(
        ctx: RuntimeContext,
        clients: CognitoUserSyncWorkflowClients,
        config: CognitoUserSyncWorkflowConfig,
    ) {
        this.logger = ctx.logger.with({
            workflow: CognitoUserSyncWf.name,
        });
        this.logger = ctx.logger;
        this.prisma = clients.prisma;
        this.awsCognitoApp = config.awsCognitoApp;
    }

    /**
     * Start the sync of aws cognito Contacts with the ECI db
     */
    public async run(): Promise<void> {
        this.logger.info("Starting aws cognito user sync workflow run");

        const CognitoUserSync = new CognitoUserSyncService({
            logger: this.logger,
            db: this.prisma,
            tenantId: this.awsCognitoApp.tenantId,
            AWSCognitoApp: this.awsCognitoApp,
        });
        await CognitoUserSync.syncFromEci();
        this.logger.info("Finished aws cognito user sync workflow run");
    }
}
