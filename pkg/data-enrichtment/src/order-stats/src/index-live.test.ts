// Test the order stats service with live data
import { PrismaClient } from "@eci/pkg/prisma";
import { describe, it } from "@jest/globals";

const prisma = new PrismaClient();

describe("Order Stats Service", () => {
    it("should calculate warehouse processing metrics for EC orders", async () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const ordersWithPackages = await prisma.order.findMany({
            where: {
                tenantId: "ken_prod",
                orderNumber: {
                    startsWith: "EC-",
                },
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                packages: {
                    some: {
                        active: true,
                    },
                },
            },
            include: {
                packages: {
                    where: {
                        active: true,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        console.log(
            `Analyzing ${ordersWithPackages.length} shipped EC orders (last 30 days)`,
        );

        const allShippingData: Array<{
            orderNumber: string;
            rawHours: number;
            workingHours: number;
            orderDate: string;
            packageDate: string;
            orderStatus: string;
            shipmentStatus: string;
            paymentStatus: string;
        }> = [];
        let dataErrors = 0;

        // Import working hours calculation
        const { differenceInWorkingHours } = await import("./working-days");

        for (const order of ordersWithPackages) {
            const firstPackage = order.packages[0];
            if (firstPackage) {
                const orderDate = new Date(order.date);
                const packageDate = new Date(firstPackage.createdAt);
                const rawHoursDiff =
                    (packageDate.getTime() - orderDate.getTime()) /
                    (1000 * 60 * 60);

                // Calculate ACTUAL working hours (the important metric!)
                const workingHoursDiff = await differenceInWorkingHours(
                    packageDate,
                    orderDate,
                );

                // Collect all data first, we'll analyze outliers separately
                if (rawHoursDiff >= 0) {
                    // Only filter out negative times (data errors)
                    allShippingData.push({
                        orderNumber: order.orderNumber,
                        rawHours: rawHoursDiff,
                        workingHours: workingHoursDiff,
                        orderDate: orderDate.toISOString(),
                        packageDate: packageDate.toISOString(),
                        orderStatus: order.orderStatus,
                        shipmentStatus: order.shipmentStatus,
                        paymentStatus: order.paymentStatus,
                    });
                } else {
                    dataErrors++;
                    console.log(
                        `Data Error: ${order.orderNumber} - ${rawHoursDiff.toFixed(1)} hours (negative time)`,
                    );
                }
            }
        }

        if (allShippingData.length > 0) {
            allShippingData.sort((a, b) => a.workingHours - b.workingHours);

            // Filter outliers (> 34 working hours = 4 business days)
            const workingHoursOutliers = allShippingData.filter(
                (order) => order.workingHours > 34,
            );
            const normalWorkingOrders = allShippingData.filter(
                (order) => order.workingHours <= 34,
            );

            // Calculate metrics using working hours
            const normalWorkingHours = normalWorkingOrders.map(
                (o) => o.workingHours,
            );
            const normalRawHours = normalWorkingOrders.map((o) => o.rawHours);

            if (normalWorkingHours.length > 0) {
                const avgWorking =
                    normalWorkingHours.reduce((sum, time) => sum + time, 0) /
                    normalWorkingHours.length;
                const medianWorking =
                    normalWorkingHours[
                        Math.floor(normalWorkingHours.length / 2)
                    ];
                const p90Working =
                    normalWorkingHours[
                        Math.floor(normalWorkingHours.length * 0.9)
                    ];
                const p95Working =
                    normalWorkingHours[
                        Math.floor(normalWorkingHours.length * 0.95)
                    ];
                const p99Working =
                    normalWorkingHours[
                        Math.floor(normalWorkingHours.length * 0.99)
                    ];

                const avgRaw =
                    normalRawHours.reduce((sum, time) => sum + time, 0) /
                    normalRawHours.length;
                const medianRaw =
                    normalRawHours[Math.floor(normalRawHours.length / 2)];
                const p90Raw =
                    normalRawHours[Math.floor(normalRawHours.length * 0.9)];

                console.log("\nWarehouse Processing Performance:");
                console.log({
                    totalOrders: normalWorkingHours.length,
                    outliersExcluded: workingHoursOutliers.length,
                    dataErrors: dataErrors,

                    // Primary metrics: Actual warehouse processing time
                    avgWorkingHours: avgWorking.toFixed(1),
                    medianWorkingHours: medianWorking.toFixed(1),
                    p90WorkingHours: p90Working.toFixed(1),
                    p95WorkingHours: p95Working.toFixed(1),
                    p99WorkingHours: p99Working.toFixed(1),
                    fastestWorkingHours: normalWorkingHours[0].toFixed(1),
                    slowestWorkingHours:
                        normalWorkingHours[
                            normalWorkingHours.length - 1
                        ].toFixed(1),

                    // Secondary metrics: Raw time (for comparison)
                    avgRawHours: avgRaw.toFixed(1),
                    medianRawHours: medianRaw.toFixed(1),
                    p90RawHours: p90Raw.toFixed(1),
                });

                // Business day conversions
                console.log("\nBusiness Day Equivalents:");
                console.log({
                    avgBusinessDays: (avgWorking / 8.5).toFixed(1),
                    medianBusinessDays: (medianWorking / 8.5).toFixed(1),
                    p90BusinessDays: (p90Working / 8.5).toFixed(1),
                    p95BusinessDays: (p95Working / 8.5).toFixed(1),
                    p99BusinessDays: (p99Working / 8.5).toFixed(1),
                });

                if (workingHoursOutliers.length > 0) {
                    console.log(
                        `\nOutliers (${workingHoursOutliers.length} orders > 34 working hours):`,
                    );
                    const paymentStatusCounts = workingHoursOutliers.reduce(
                        (acc, order) => {
                            acc[order.paymentStatus] =
                                (acc[order.paymentStatus] || 0) + 1;
                            return acc;
                        },
                        {} as Record<string, number>,
                    );
                    console.log(
                        "Payment status distribution:",
                        paymentStatusCounts,
                    );
                }
            }
        }
    }, 30000);
});
