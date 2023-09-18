import { ILogger } from "@eci/pkg/logger";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { application } from "./application";
import { context } from "./context";
export interface ServerConfig {
    logger?: ILogger;
}

const server = new ApolloServer({
    introspection: true,
    plugins: [],
    /**
     * this is the recommended way to use graphql-modules with apollo
     */
    gateway: {
        async load() {
            return { executor: application.createApolloExecutor() };
        },
        onSchemaLoadOrUpdate(callback) {
            callback({ apiSchema: application.schema } as any);
            return () => {};
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async stop() {},
    },
});

const handler = startServerAndCreateNextHandler(server, {
    context,
});
export { handler };
