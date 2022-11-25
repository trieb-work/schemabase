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
  | "braintreeTransactions"
  | "bankaccounts";

type CronJobReturn = CronJobState & {
  currentlyLocked: boolean
}

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
    currentlyLocked: boolean = false,
  ) {
    const cronState = await this.db.cronJobState.upsert({
      where: {
        id,
      },
      create: upsertObject,
      update: upsertObject,
    });

    return { ...cronState, currentlyLocked };
  }

  private async getEntry(id: string) {
    return this.db.cronJobState.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Get the cron state. Can optionally lock the entry, to prevent parallel
   * transactions. Returns false if currently locked
   * @param lock
   * @returns
   */
  public async get(lock?: boolean): Promise<CronJobReturn> {
    const id = this.generateId();
    const existingState = await this.getEntry(id);
    let currentlyLocked = false;
    if (existingState?.locked) currentlyLocked = true;
    const locked = lock ?? undefined;
    return this.upsert(id, { id, locked }, currentlyLocked);
  }

  public async set(opts: {
    lastRun: Date;
    lastRunStatus?: CronJobStatus;
    locked?: boolean;
  }) {
    const id = this.generateId();
    const updateObject: Prisma.CronJobStateCreateInput = {
      id,
      lastRun: opts.lastRun,
      lastRunStatus: opts.lastRunStatus,
      locked: opts.locked,
    };
    return this.upsert(id, updateObject);
  }
}
