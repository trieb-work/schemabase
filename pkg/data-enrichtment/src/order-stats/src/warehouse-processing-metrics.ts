import { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import { differenceInWorkingHours } from "./working-days";

export interface WarehouseProcessingMetrics {
    totalOrders: number;
    outliersExcluded: number;
    dataErrors: number;
    
    // Primary metrics: Actual warehouse processing time (working hours)
    avgWorkingHours: number;
    medianWorkingHours: number;
    p90WorkingHours: number;
    p95WorkingHours: number;
    p99WorkingHours: number;
    fastestWorkingHours: number;
    slowestWorkingHours: number;
    
    // Business day equivalents
    avgBusinessDays: number;
    medianBusinessDays: number;
    p90BusinessDays: number;
    p95BusinessDays: number;
    p99BusinessDays: number;
    
    // Secondary metrics: Raw time (for comparison)
    avgRawHours: number;
    medianRawHours: number;
    p90RawHours: number;
    
    // Outlier analysis
    outliers: {
        totalOutliers: number;
        paymentStatusDistribution: Record<string, number>;
    };
}

export interface OrderProcessingData {
    orderNumber: string;
    rawHours: number;
    workingHours: number;
    orderDate: string;
    packageDate: string;
    orderStatus: string;
    shipmentStatus: string;
    paymentStatus: string;
}

export class WarehouseProcessingMetricsService {
    private readonly db: PrismaClient;
    private readonly tenantId: string;
    private readonly logger: ILogger;

    constructor({
        db,
        tenantId,
        logger,
    }: {
        db: PrismaClient;
        tenantId: string;
        logger: ILogger;
    }) {
        this.db = db;
        this.tenantId = tenantId;
        this.logger = logger;
    }

    /**
     * Calculate warehouse processing metrics for EC orders in a date range
     */
    public async calculateProcessingMetrics(
        startDate: Date,
        endDate: Date,
        orderPrefix: string = "EC-",
        outlierThresholdHours: number = 34, // 4 business days
    ): Promise<WarehouseProcessingMetrics> {
        this.logger.info("Calculating warehouse processing metrics", {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            orderPrefix,
            outlierThresholdHours,
        });

        const ordersWithPackages = await this.getShippedOrders(startDate, endDate, orderPrefix);
        this.logger.info(`Found ${ordersWithPackages.length} shipped ${orderPrefix} orders`);

        const processingData = await this.calculateProcessingData(ordersWithPackages);
        
        return this.generateMetrics(processingData, outlierThresholdHours);
    }

    /**
     * Get shipped orders (orders with packages) for the specified date range and prefix
     */
    private async getShippedOrders(startDate: Date, endDate: Date, orderPrefix: string) {
        return this.db.order.findMany({
            where: {
                tenantId: this.tenantId,
                orderNumber: {
                    startsWith: orderPrefix,
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
    }

    /**
     * Calculate processing data for all orders
     */
    private async calculateProcessingData(orders: any[]): Promise<{
        validData: OrderProcessingData[];
        dataErrors: number;
    }> {
        const validData: OrderProcessingData[] = [];
        let dataErrors = 0;

        for (const order of orders) {
            const firstPackage = order.packages[0];
            if (firstPackage) {
                const orderDate = new Date(order.date);
                const packageDate = new Date(firstPackage.createdAt);
                const rawHoursDiff = (packageDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
                
                // Calculate actual working hours
                const workingHoursDiff = await differenceInWorkingHours(packageDate, orderDate);
                
                // Only include orders with valid timing (no negative times)
                if (rawHoursDiff >= 0) {
                    validData.push({
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
                    this.logger.warn("Data error: negative shipping time", {
                        orderNumber: order.orderNumber,
                        rawHours: rawHoursDiff,
                    });
                }
            }
        }

        return { validData, dataErrors };
    }

    /**
     * Generate metrics from processing data
     */
    private generateMetrics(
        data: { validData: OrderProcessingData[]; dataErrors: number },
        outlierThresholdHours: number,
    ): WarehouseProcessingMetrics {
        const { validData, dataErrors } = data;
        
        if (validData.length === 0) {
            throw new Error("No valid processing data found");
        }

        // Sort by working hours
        validData.sort((a, b) => a.workingHours - b.workingHours);
        
        // Filter outliers
        const outliers = validData.filter(order => order.workingHours > outlierThresholdHours);
        const normalOrders = validData.filter(order => order.workingHours <= outlierThresholdHours);
        
        // Extract working hours and raw hours for calculations
        const workingHours = normalOrders.map(o => o.workingHours);
        const rawHours = normalOrders.map(o => o.rawHours);
        
        // Calculate percentiles and averages
        const avgWorking = workingHours.reduce((sum, time) => sum + time, 0) / workingHours.length;
        const medianWorking = workingHours[Math.floor(workingHours.length / 2)];
        const p90Working = workingHours[Math.floor(workingHours.length * 0.9)];
        const p95Working = workingHours[Math.floor(workingHours.length * 0.95)];
        const p99Working = workingHours[Math.floor(workingHours.length * 0.99)];

        const avgRaw = rawHours.reduce((sum, time) => sum + time, 0) / rawHours.length;
        const medianRaw = rawHours[Math.floor(rawHours.length / 2)];
        const p90Raw = rawHours[Math.floor(rawHours.length * 0.9)];

        // Analyze outlier payment status
        const paymentStatusDistribution = outliers.reduce((acc, order) => {
            acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalOrders: workingHours.length,
            outliersExcluded: outliers.length,
            dataErrors,
            
            // Primary metrics: Working hours (8.5 hour business days)
            avgWorkingHours: Number(avgWorking.toFixed(1)),
            medianWorkingHours: Number(medianWorking.toFixed(1)),
            p90WorkingHours: Number(p90Working.toFixed(1)),
            p95WorkingHours: Number(p95Working.toFixed(1)),
            p99WorkingHours: Number(p99Working.toFixed(1)),
            fastestWorkingHours: Number(workingHours[0].toFixed(1)),
            slowestWorkingHours: Number(workingHours[workingHours.length - 1].toFixed(1)),
            
            // Business day equivalents (8.5 hours per business day)
            avgBusinessDays: Number((avgWorking / 8.5).toFixed(1)),
            medianBusinessDays: Number((medianWorking / 8.5).toFixed(1)),
            p90BusinessDays: Number((p90Working / 8.5).toFixed(1)),
            p95BusinessDays: Number((p95Working / 8.5).toFixed(1)),
            p99BusinessDays: Number((p99Working / 8.5).toFixed(1)),
            
            // Secondary metrics: Raw time
            avgRawHours: Number(avgRaw.toFixed(1)),
            medianRawHours: Number(medianRaw.toFixed(1)),
            p90RawHours: Number(p90Raw.toFixed(1)),
            
            // Outlier analysis
            outliers: {
                totalOutliers: outliers.length,
                paymentStatusDistribution,
            },
        };
    }

    /**
     * Get metrics for the last N days
     */
    public async getMetricsForLastDays(
        days: number,
        orderPrefix: string = "EC-",
        outlierThresholdHours: number = 34,
    ): Promise<WarehouseProcessingMetrics> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return this.calculateProcessingMetrics(startDate, endDate, orderPrefix, outlierThresholdHours);
    }

    /**
     * Format metrics for Saleor metadata (JSON-serializable)
     */
    public formatForSaleorMetadata(metrics: WarehouseProcessingMetrics): Record<string, string> {
        return {
            // Summary
            totalOrders: metrics.totalOrders.toString(),
            dataErrors: metrics.dataErrors.toString(),
            outliersExcluded: metrics.outliersExcluded.toString(),
            
            // Key performance indicators
            avgWorkingHours: metrics.avgWorkingHours.toString(),
            medianWorkingHours: metrics.medianWorkingHours.toString(),
            p90WorkingHours: metrics.p90WorkingHours.toString(),
            p95WorkingHours: metrics.p95WorkingHours.toString(),
            
            // Business days
            avgBusinessDays: metrics.avgBusinessDays.toString(),
            medianBusinessDays: metrics.medianBusinessDays.toString(),
            p90BusinessDays: metrics.p90BusinessDays.toString(),
            
            // For storefront display
            processingTimeDisplay: `${metrics.p90WorkingHours}h (${metrics.p90BusinessDays} business days)`,
            lastUpdated: new Date().toISOString(),
        };
    }
}
