import { PrismaClient } from "@eci/pkg/prisma";
import { DataSource } from "apollo-datasource";

let prismaGlobal: PrismaClient;

/**
 * Wrapper around prisma to turn it into a DataSource
 */
export class DB extends DataSource {
  private readonly prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = prismaGlobal || new PrismaClient();
    prismaGlobal = this.prisma;
  }

  public get client() {
    return this.prisma;
  }
}
