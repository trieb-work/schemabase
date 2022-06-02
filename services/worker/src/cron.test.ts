import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { scheduleAllWorkflows } from "./cron";
import { env } from "@eci/pkg/env";
import { Logger } from "@eci/pkg/logger";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Workflow scheduler", () => {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
    enableElasticLogDrain: env.get("ECI_ENV") === "production",
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

  test("It should work to schedule all workflows", async () => {
    await scheduleAllWorkflows({ prisma, logger, redisConnection });
  }, 90000);
});
