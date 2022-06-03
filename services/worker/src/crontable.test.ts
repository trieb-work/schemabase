import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { CronTable } from "./crontable";
import { env } from "@eci/pkg/env";
import { Logger } from "@eci/pkg/logger";
import { sleep } from "@eci/pkg/miscHelper/time";
import Redis from "ioredis";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Workflow scheduler", () => {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
    // enableElasticLogDrain: env.get("ECI_ENV") === "production",
  });
  logger.with({
    test: 'jest-unit-test'
  })
  const prisma = new PrismaClient();
  const redisConnection = {
    host: env.require("REDIS_HOST"),
    port: parseInt(env.require("REDIS_PORT")),
    password: env.require("REDIS_PASSWORD"),
  };
  // TODO: create tenant + integration in eci db

  const redis = new Redis(redisConnection);
  const crontable = new CronTable({ prisma, logger, redisConnection });

  test("It should work to schedule all workflows", async () => {
    await crontable.scheduleTenantWorkflows();
    await sleep(10000); // wait for the workflows to finish
    const keys = await redis.keys("bull:eci:test:test:*");
    console.log("keys", keys)
    console.log("scheduledWorkflows", crontable.scheduler.scheduledWorkflows)
    await crontable.scheduler.shutdownScheduler();
    await redis.quit();
  }, 90000);
});
