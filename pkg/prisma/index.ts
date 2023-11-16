import { PrismaClient as BaseClient } from "@prisma/client";
import { env } from "@eci/pkg/env";
export * from "@prisma/client";
export type {
    Order as OrderModel,
    Package as PackageModel,
    PackageEvent as PackageEventModel,
    TransactionalEmail as TransactionalEmailModel,
} from "@prisma/client";

export class PrismaClient extends BaseClient {
    constructor() {
        super({ datasources: { db: { url: env.require("DATABASE_URL") } } });
    }
}

const prisma = new PrismaClient();
/**
 * Import this prisma client to prevent the creation of a new prisma instance all the time
 */
export default prisma;
