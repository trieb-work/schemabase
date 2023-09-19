import { FBT } from "@eci/pkg/data-enrichment/src/frequently-bought-with";
import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";
import { PrismaSelect } from "@paljs/plugins";

const defaultFields: {
    [key: string]:
        | { [key: string]: boolean }
        | ((select: any) => { [key: string]: boolean });
} = {
    /**
     * When we query for contact we always selet minimum the ID, as this is needed
     * for the manually added Contact resolver to work
     * @returns
     */
    Contact: () => ({ id: true }),
    Product: () => ({ id: true }),
};

export const resolvers: Resolvers<Context> = {
    Query: {
        orders: async (_parent, { input }, ctx, info) => {
            const claims = await ctx.authorizeUser([]);
            /**
             * The SELECT statement for Prisma - we have to filter
             * the resulting select, as "edges" is just the input data format
             */
            const select = new PrismaSelect(info).value.select?.edges;

            if (!claims.tenants || claims.tenants.length <= 0)
                throw new Error(`You don't have access to any tenants`);
            const orders = await ctx.dataSources.db.client.order.findMany({
                where: {
                    tenantId: {
                        in: claims.tenants.map((t) => t.id),
                    },
                },
                take: input.first,
                orderBy: input.orderBy,
                ...(input.cursor && {
                    skip: 1, // Do not include the cursor itself in the query result.
                    cursor: {
                        id: input.cursor,
                    },
                }),
                ...select,
            });
            if (orders.length === 0) {
                return {
                    totalCount: 0,
                    edges: [],
                    pageInfo: {
                        endCursor: null,
                        hasNextPage: false,
                    },
                };
            }
            const newCursor = orders[orders.length - 1].id;
            const nextPage = await ctx.dataSources.db.client.order.findMany({
                // Same as before, limit the number of events returned by this query.
                take: input.first,
                skip: 1, // Do not include the cursor itself in the query result.
                cursor: {
                    id: newCursor,
                },
            });
            return {
                edges: orders,
                pageInfo: {
                    endCursor: newCursor,
                    hasNextPage: nextPage.length > 0,
                },
            };
        },
        order: async (_parent, args, ctx, info) => {
            /**
             * The select statement for Prisma and the "Order" model. We filter for
             * Order only, as we have also some custom resolvers that can't be created
             * in just one select statement
             **/
            const select = new PrismaSelect(info, {
                defaultFields,
            }).valueWithFilter("Order");
            const claims = await ctx.authorizeUser([]);

            if (!claims.tenants || claims.tenants.length <= 0)
                throw new Error(`You don't have access to any tenants`);
            return ctx.dataSources.db.client.order.findFirst({
                where: {
                    tenantId: {
                        in: claims.tenants.map((t) => t.id),
                    },
                    id: args.id,
                    orderNumber: args.orderNumber,
                },
                ...select,
            });
        },
        products: async (_parent, { input }, ctx, info) => {
            const claims = await ctx.authorizeUser([]);
            /**
             * The SELECT statement for Prisma - we have to filter
             * the resulting select, as "edges" is just the input data format
             */
            const select = new PrismaSelect(info).value.select?.edges;

            if (!claims.tenants || claims.tenants.length <= 0)
                throw new Error(`You don't have access to any tenants`);
            const products = await ctx.dataSources.db.client.product.findMany({
                where: {
                    tenantId: {
                        in: claims.tenants.map((t) => t.id),
                    },
                },
                take: input.first,
                ...(input.cursor && {
                    skip: 1, // Do not include the cursor itself in the query result.
                    cursor: {
                        id: input.cursor,
                    },
                }),
                ...select,
            });
            if (products.length === 0) {
                return {
                    totalCount: 0,
                    edges: [],
                    pageInfo: {
                        endCursor: null,
                        hasNextPage: false,
                    },
                };
            }
            const newCursor = products[products.length - 1].id;
            const nextPage = await ctx.dataSources.db.client.product.findMany({
                // Same as before, limit the number of events returned by this query.
                take: input.first,
                skip: 1, // Do not include the cursor itself in the query result.
                cursor: {
                    id: newCursor,
                },
            });
            return {
                edges: products,
                pageInfo: {
                    endCursor: newCursor,
                    hasNextPage: nextPage.length > 0,
                },
            };
        },
        product: async (_parent, args, ctx, info) => {
            /**
             * The select statement for Prisma and the "Product" model. We filter for
             * Product only, as we have also some custom resolvers that can't be created
             * in just one select statement
             **/
            const select = new PrismaSelect(info, {
                defaultFields,
            }).valueWithFilter("Product");
            const claims = await ctx.authorizeUser([]);

            if (!claims.tenants || claims.tenants.length <= 0)
                throw new Error(`You don't have access to any tenants`);
            return ctx.dataSources.db.client.product.findUnique({
                where: {
                    tenantId: {
                        in: claims.tenants.map((t) => t.id),
                    },
                    id: args.id,
                },
                ...select,
            });
        },
    },
    Contact: {
        totalOrders: async (parent, _args, ctx) => {
            if (!parent.id) return null;
            const orderCount = await ctx.dataSources.db.client.order.aggregate({
                where: {
                    mainContactId: parent.id,
                },
                _count: {
                    _all: true,
                },
            });
            return orderCount._count._all;
        },
    },
    Product: {
        frequentlyBoughtTogether: async (parent, _args, ctx) => {
            if (!parent.id) return null;
            const claims = await ctx.authorizeUser([]);
            const fbt = new FBT({
                db: ctx.dataSources.db.client,
                tenantId: claims.tenants?.map((t) => t.id) || [],
                logger: ctx.logger,
            });
            return fbt.getProductsBoughtTogether(parent.id);
        },
    },
};
