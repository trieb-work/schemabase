import { env } from "@eci/pkg/env";

import { PrismaClient } from "@eci/pkg/prisma";

import { CronTable } from "./crontable";
import { LoggerWithElastic } from "@eci/pkg/logger/src/loggerWithElastic";
import { TrackTrace } from "./trackTrace";

async function main() {
    const logger = new LoggerWithElastic({
        meta: {
            env: env.require("ECI_ENV"),
        },
        enableElasticLogDrain: false,
    }).with({ "service.name": "eci" });

    logger.info("Starting worker");

    const prisma = new PrismaClient();

    const redisConnection = {
        host: env.require("REDIS_HOST"),
        port: parseInt(env.require("REDIS_PORT")),
        password: env.require("REDIS_PASSWORD"),
    };
    const crontable = new CronTable({ prisma, logger, redisConnection });

    crontable.scheduleTenantWorkflows();

    const trackTrace = new TrackTrace({ logger, db: prisma, redisConnection });
    trackTrace.schedule();
}

main().catch((err) => {
    const logger = new LoggerWithElastic(/* TODO: */);
    logger.error("Main process failed", err);
    console.error(err);
    process.exit(1);
});
