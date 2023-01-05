import { PrismaClient } from "@eci/pkg/prisma";
import { DataSource } from "apollo-datasource";
/**
 * Wrapper around prisma to turn it into a DataSource
 */
export class DB extends DataSource {
  private readonly prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  public get client() {
    return this.prisma;
  }
}
