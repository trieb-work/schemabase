import type { ILogger } from "@eci/pkg/logger";
import {
    differenceInDays,
    differenceInBusinessDays,
    differenceInHours,
} from "date-fns";
import { differenceInWorkingDays, differenceInWorkingHours, calculatePercentile } from "./working-days";
export * from "./warehouse-processing-metrics";

interface OrderStatsServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    tenantId: string;
}

interface OrderShippingStats {
    orderId: string;
    orderNumber: string;
    orderDate: Date;
    firstShipmentDate: Date | null;
    shippingDays: number | null;
    shippingHours: number | null;
    shippingWorkingHours: number | null;
    shippingBusinessDays: number | null;
    shippingWorkingDays: number | null;
    hasShipped: boolean;
    orderStatus: string;
    shipmentStatus: string;
}

export class OrderStatsService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly tenantId: string;

    public constructor(config: OrderStatsServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.tenantId = config.tenantId;
    }

    /**
     * Calculate shipping statistics for all orders in the tenant
     * This method analyzes how fast orders are shipped by calculating:
     * - Days and hours from order creation to first shipment
     * - Business days from order creation to first shipment
     * - Working days from order creation to first shipment
     * - Whether the order has been shipped at all
     */
    public async calculateShippingStats(
        limit?: number,
    ): Promise<OrderShippingStats[]> {
        this.logger.info(
            `Starting shipping stats calculation for tenant ${this.tenantId}`,
        );

        const stats: OrderShippingStats[] = [];
        const batchSize = 100; // Process orders in batches to avoid MySQL placeholder limit
        let skip = 0;
        let totalProcessed = 0;

        while (true) {
            // Get orders in batches with their packages
            const orders = await this.db.order.findMany({
                where: {
                    tenantId: this.tenantId,
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
                take: batchSize,
                skip: skip,
            });

            if (orders.length === 0) {
                break; // No more orders to process
            }

            this.logger.info(
                `Processing batch of ${orders.length} orders (${totalProcessed + 1}-${totalProcessed + orders.length})`,
            );

            for (const order of orders) {
                const orderStats = this.calculateOrderShippingStats(order);
                stats.push(orderStats);
            }

            totalProcessed += orders.length;
            skip += batchSize;

            // If limit is specified and we've reached it, break
            if (limit && totalProcessed >= limit) {
                stats.splice(limit); // Trim to exact limit
                break;
            }

            // If we got fewer orders than batch size, we're done
            if (orders.length < batchSize) {
                break;
            }
        }

        this.logger.info(
            `Calculated shipping stats for ${stats.length} orders`,
        );

        // Log some summary statistics
        const shippedOrders = stats.filter((s) => s.hasShipped);
        const avgShippingDays =
            shippedOrders.length > 0
                ? shippedOrders.reduce(
                      (sum, s) => sum + (s.shippingDays || 0),
                      0,
                  ) / shippedOrders.length
                : 0;
        const avgShippingHours =
            shippedOrders.length > 0
                ? shippedOrders.reduce(
                      (sum, s) => sum + (s.shippingHours || 0),
                      0,
                  ) / shippedOrders.length
                : 0;
        const avgBusinessDays =
            shippedOrders.length > 0
                ? shippedOrders.reduce(
                      (sum, s) => sum + (s.shippingBusinessDays || 0),
                      0,
                  ) / shippedOrders.length
                : 0;

        this.logger.info(`Shipping stats summary:`, {
            totalOrders: stats.length,
            shippedOrders: shippedOrders.length,
            unshippedOrders: stats.length - shippedOrders.length,
            avgShippingDays: Math.round(avgShippingDays * 100) / 100,
            avgShippingHours: Math.round(avgShippingHours * 100) / 100,
            avgBusinessDays: Math.round(avgBusinessDays * 100) / 100,
        });

        return stats;
    }

    /**
     * Calculate shipping stats for a single order
     */
    private calculateOrderShippingStats(order: any): OrderShippingStats {
        const firstPackage =
            order.packages.length > 0 ? order.packages[0] : null;
        const hasShipped = firstPackage !== null;

        let shippingDays: number | null = null;
        let shippingHours: number | null = null;
        let shippingBusinessDays: number | null = null;
        let shippingWorkingDays: number | null = null;

        if (hasShipped && firstPackage && firstPackage.createdAt) {
            firstShipmentDate = firstPackage.createdAt;
            shippingDays = differenceInDays(firstShipmentDate, order.date);
            shippingHours = differenceInHours(firstShipmentDate, order.date);
            shippingBusinessDays = differenceInBusinessDays(firstShipmentDate, order.date);
            shippingWorkingDays = differenceInWorkingDays(firstShipmentDate, order.date);
            
            // Debug logging for suspicious cases
            if (shippingHours > 48) {
                this.logger.info(`Long shipping time detected:`, {
                    orderNumber: order.orderNumber,
                    orderDate: order.date.toISOString(),
                    packageCreated: firstShipmentDate.toISOString(),
                    shippingHours,
                    shippingDays,
                });
            }
        }

        return {
            orderId: order.id,
{{ ... }}
            orderDate: order.date,
            firstShipmentDate,
            shippingDays,
            shippingHours,
            shippingBusinessDays,
            shippingWorkingDays,
            hasShipped,
            orderStatus: order.orderStatus,
            shipmentStatus: order.shipmentStatus,
        };
    }

    /**
     * Get orders that are taking longer than expected to ship
     * @param maxBusinessDays Maximum business days before considering an order delayed
     * @param limit Optional limit on number of orders to analyze
     */
    public async getDelayedOrders(
        maxBusinessDays: number = 3,
        limit?: number,
    ): Promise<OrderShippingStats[]> {
        const stats = await this.calculateShippingStats(limit);

        return stats.filter((stat) => {
            if (!stat.hasShipped) {
                // Check if unshipped orders are overdue
                const daysSinceOrder = differenceInWorkingDays(
                    new Date(),
                    stat.orderDate,
                );
                return daysSinceOrder > maxBusinessDays;
            } else {
                // Check if shipped orders took too long
                return (
                    stat.shippingWorkingDays !== null &&
                    stat.shippingWorkingDays > maxBusinessDays
                );
            }
        });
    }

    /**
     * Get shipping performance metrics for a date range - ONLY for orders with packages
     */
    public async getShippingPerformanceMetrics(startDate: Date, endDate: Date) {
        this.logger.info(`Getting performance metrics from ${startDate.toISOString()} to ${endDate.toISOString()}`);
        
        // ONLY get orders that have packages (shipped orders)
        const orders = await this.db.order.findMany({
            where: {
                tenantId: this.tenantId,
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
        });

        this.logger.info(`Found ${orders.length} orders with packages in date range`);

        const stats = orders.map((order) =>
            this.calculateOrderShippingStats(order),
        );
        const shippedStats = stats.filter((s) => s.hasShipped);

        if (shippedStats.length === 0) {
            return {
                totalOrders: stats.length,
                shippedOrders: 0,
                shippingRate: 0,
                avgShippingDays: 0,
                avgShippingHours: 0,
                avgBusinessDays: 0,
                medianShippingDays: 0,
                medianShippingHours: 0,
                medianBusinessDays: 0,
            };
        }

        const shippingDays = shippedStats
            .map((s) => s.shippingDays!)
            .sort((a, b) => a - b);
        const shippingHours = shippedStats
            .map((s) => s.shippingHours!)
            .sort((a, b) => a - b);
        const businessDays = shippedStats
            .map((s) => s.shippingBusinessDays!)
            .sort((a, b) => a - b);

        return {
            totalOrders: stats.length,
            shippedOrders: shippedStats.length,
            shippingRate: (shippedStats.length / stats.length) * 100,
            avgShippingDays:
                shippingDays.reduce((sum, days) => sum + days, 0) /
                shippingDays.length,
            avgShippingHours:
                shippingHours.reduce((sum, hours) => sum + hours, 0) /
                shippingHours.length,
            avgBusinessDays:
                businessDays.reduce((sum, days) => sum + days, 0) /
                businessDays.length,
            medianShippingDays: shippingDays[Math.floor(shippingDays.length / 2)],
            medianShippingHours: shippingHours[Math.floor(shippingHours.length / 2)],
            medianBusinessDays: businessDays[Math.floor(businessDays.length / 2)],
            // Percentile metrics - "90% of orders shipped within X hours"
            percentile90Hours: calculatePercentile(shippingHours, 90),
            percentile95Hours: calculatePercentile(shippingHours, 95),
            percentile99Hours: calculatePercentile(shippingHours, 99),
        };
    }
}
