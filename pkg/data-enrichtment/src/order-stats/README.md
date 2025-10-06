# Order Stats Workflows

We use existing information on orders and shipments to calculate order statistics, particularly focusing on shipping speed metrics.

## Features

- **Shipping Speed Analysis**: Calculate how long it takes from order creation to first shipment
- **Working Days Calculation**: Takes into account weekends and German holidays
- **Performance Metrics**: Get comprehensive shipping performance data for any date range
- **Delayed Order Detection**: Identify orders that are taking longer than expected to ship

## Usage

### Programmatic Usage

```typescript
import { OrderStatsService } from "./src";
import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";

const service = new OrderStatsService({
    db: new PrismaClient(),
    logger: new AssertionLogger(),
    tenantId: "your-tenant-id",
});

// Calculate shipping stats for all orders
const stats = await service.calculateShippingStats();

// Find delayed orders (taking more than 3 working days)
const delayedOrders = await service.getDelayedOrders(3);

// Get performance metrics for last 30 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);
const metrics = await service.getShippingPerformanceMetrics(startDate, endDate);
```

### CLI Usage

```bash
# Run analysis for a specific tenant
pnpm tsx src/order-stats/src/cli.ts --tenant ken_prod

# Find orders delayed more than 5 working days
pnpm tsx src/order-stats/src/cli.ts --tenant ken_prod --delayed-days 5

# Get performance metrics for last 60 days
pnpm tsx src/order-stats/src/cli.ts --tenant ken_prod --performance-days 60
```

### Running Tests

```bash
# Run the live test with real data
pnpm jest src/order-stats/src/index-live.test.ts
```

## Data Structure

The service analyzes the relationship between:
- **Orders**: Main order entities with creation dates
- **Packages**: Shipment packages linked to orders with creation dates (representing when shipment was created)

## Metrics Calculated

- **Shipping Days**: Total calendar days from order to first shipment
- **Business Days**: Business days (excluding weekends) from order to first shipment  
- **Working Days**: Business days excluding weekends AND German holidays
- **Shipping Rate**: Percentage of orders that have been shipped
- **Delayed Orders**: Orders taking longer than expected to ship

## Holiday Support

Currently supports German holidays for 2024-2025. You can extend the holiday list in `working-days.ts` for other regions or years.
