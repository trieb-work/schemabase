// reviews.io sync workflow
import { ReviewsioProductRatingSyncService } from "@eci/pkg/integration-reviewsio";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ReviewsioApp } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type ReviewsioSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ReviewsioSyncWorkflowConfig = {
  reviewsioApp: ReviewsioApp;
};

export class ReviewsioSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private reviewsioApp: ReviewsioApp;

  public constructor(
    ctx: RuntimeContext,
    clients: ReviewsioSyncWorkflowClients,
    config: ReviewsioSyncWorkflowConfig,
  ) {
    this.prisma = clients.prisma;
    this.reviewsioApp = config.reviewsioApp;
    this.logger = ctx.logger.with({
      workflow: ReviewsioSyncWf.name,
      reviewsIoAppId: this.reviewsioApp.id,
    });
  }

  public async run(): Promise<void> {
    this.logger.info("Starting reviews.io sync workflow run");
    const reviewsioSyncService = new ReviewsioProductRatingSyncService({
      logger: this.logger,
      db: this.prisma,
      reviewsioApp: this.reviewsioApp,
    });
    await reviewsioSyncService.syncToEci();
  }
}
