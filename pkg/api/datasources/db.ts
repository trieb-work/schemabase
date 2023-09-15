import { PrismaClient } from "@eci/pkg/prisma";

let prismaGlobal: PrismaClient;

/**
 * Wrapper around prisma to turn it into a DataSource
 */
export class DB {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = prismaGlobal || new PrismaClient();
        prismaGlobal = this.prisma;
    }

    public get client() {
        return this.prisma;
    }
}
