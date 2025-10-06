#!/usr/bin/env tsx

import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { OrderStatsService } from ".";

const prisma = new PrismaClient();

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option("tenant", {
            alias: "t",
            type: "string",
            description: "Tenant ID to analyze",
            demandOption: true,
        })
        .option("delayed-days", {
            alias: "d",
            type: "number",
            description:
                "Maximum working days before considering an order delayed",
            default: 3,
        })
        .option("performance-days", {
            alias: "p",
            type: "number",
            description: "Number of days to analyze for performance metrics",
            default: 30,
        })
        .help().argv;

    const logger = new AssertionLogger();
    const service = new OrderStatsService({
        db: prisma,
        logger,
        tenantId: argv.tenant,
    });

    console.log(
        `\n🚀 Starting Order Stats Analysis for tenant: ${argv.tenant}\n`,
    );

    try {
        // Calculate overall shipping stats
        console.log("📊 Calculating overall shipping statistics...");
        const stats = await service.calculateShippingStats();

        const shippedOrders = stats.filter((s) => s.hasShipped);
        const unshippedOrders = stats.filter((s) => !s.hasShipped);

        console.log(`\n📈 Overall Statistics:`);
        console.log(`   Total Orders: ${stats.length}`);
        console.log(
            `   Shipped Orders: ${shippedOrders.length} (${((shippedOrders.length / stats.length) * 100).toFixed(1)}%)`,
        );
        console.log(`   Unshipped Orders: ${unshippedOrders.length}`);

        if (shippedOrders.length > 0) {
            const avgDays =
                shippedOrders.reduce(
                    (sum, s) => sum + (s.shippingDays || 0),
                    0,
                ) / shippedOrders.length;
            const avgBusinessDays =
                shippedOrders.reduce(
                    (sum, s) => sum + (s.shippingBusinessDays || 0),
                    0,
                ) / shippedOrders.length;
            const avgWorkingDays =
                shippedOrders.reduce(
                    (sum, s) => sum + (s.shippingWorkingDays || 0),
                    0,
                ) / shippedOrders.length;

            console.log(`   Average Shipping Time: ${avgDays.toFixed(1)} days`);
            console.log(
                `   Average Business Days: ${avgBusinessDays.toFixed(1)} days`,
            );
            console.log(
                `   Average Working Days: ${avgWorkingDays.toFixed(1)} days`,
            );
        }

        // Find delayed orders
        console.log(
            `\n⚠️  Finding orders delayed more than ${argv.delayedDays} working days...`,
        );
        const delayedOrders = await service.getDelayedOrders(argv.delayedDays);

        console.log(`   Found ${delayedOrders.length} delayed orders`);

        if (delayedOrders.length > 0) {
            console.log(`\n   Top 5 most delayed orders:`);
            delayedOrders
                .sort(
                    (a, b) =>
                        (b.shippingWorkingDays || 0) -
                        (a.shippingWorkingDays || 0),
                )
                .slice(0, 5)
                .forEach((order, index) => {
                    console.log(
                        `   ${index + 1}. Order ${order.orderNumber}: ${order.shippingWorkingDays || "N/A"} working days`,
                    );
                });
        }

        // Performance metrics for recent period
        console.log(
            `\n📅 Performance metrics for last ${argv.performanceDays} days...`,
        );
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - argv.performanceDays);

        const metrics = await service.getShippingPerformanceMetrics(
            startDate,
            endDate,
        );

        console.log(
            `   Period: ${startDate.toDateString()} - ${endDate.toDateString()}`,
        );
        console.log(`   Total Orders: ${metrics.totalOrders}`);
        console.log(`   Shipped Orders: ${metrics.shippedOrders}`);
        console.log(`   Shipping Rate: ${metrics.shippingRate.toFixed(1)}%`);

        if (metrics.shippedOrders > 0) {
            console.log(
                `   Average Shipping Days: ${metrics.avgShippingDays.toFixed(1)}`,
            );
            console.log(
                `   Average Business Days: ${metrics.avgBusinessDays.toFixed(1)}`,
            );
            console.log(
                `   Median Shipping Days: ${metrics.medianShippingDays}`,
            );
            console.log(
                `   Median Business Days: ${metrics.medianBusinessDays}`,
            );
        }

        console.log(`\n✅ Analysis complete!`);
    } catch (error) {
        console.error("❌ Error during analysis:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
