import {
  PrismaClient,
  CronJobStatus,
  Prisma,
  CronJobState,
} from "@eci/pkg/prisma";

type SyncEntity =
  | "items"
  | "contacts"
  | "orders"
  | "payments"
  | "invoices"
  | "packages"
  | "salesorders"
  | "braintreeTransactions";

interface CronStateConfig {
  db: PrismaClient;

  /**
   * For everything around products/articles/variants etc. use "items"
   */
  syncEntity: SyncEntity;
  /**
   * The AppId of the sync entity - this can be the id of the ZohoApp or the installedSaleorApp or
   * any other app
   */
  appId: string;
  tenantId: string;
}

export class CronStateHandler {
  private readonly db: PrismaClient;

  private readonly syncEntity: SyncEntity;

  private readonly appId: string;

  private readonly tenantId: string;

  public constructor(config: CronStateConfig) {
    this.db = config.db;
    this.syncEntity = config.syncEntity;
    this.appId = config.appId;
    this.tenantId = config.tenantId;
  }

  /**
   * Generates the JobId automatically using our internal schema
   * @returns
   */
  private generateId() {
    return `${this.tenantId}_${this.appId}_${this.syncEntity}`;
  }

  private async upsert(
    id: string,
    upsertObject: Prisma.CronJobStateCreateInput,
  ) {
    const cronState = await this.db.cronJobState.upsert({
      where: {
        id,
      },
      create: upsertObject,
      update: upsertObject,
    });

    return cronState;
  }

  public async get(): Promise<CronJobState> {
    const id = this.generateId();
    return this.upsert(id, { id });
  }

  public async set(opts: { lastRun: Date; lastRunStatus?: CronJobStatus }) {
    const id = this.generateId();
    const updateObject = {
      id,
      lastRun: opts.lastRun,
      lastRunStatus: opts.lastRunStatus,
    };
    return this.upsert(id, updateObject);
  }
}
