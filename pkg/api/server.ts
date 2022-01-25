import { ILogger } from "@eci/pkg/logger";
import { ApolloServer } from "apollo-server-micro";

import { application } from "./application";
import { context } from "./context";
import { DB } from "./datasources";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
export interface ServerConfig {
  logger?: ILogger;
}

export const server = (config?: ServerConfig): ApolloServer => {
  return new ApolloServer({
    schema: application.createSchemaForApollo(),
    context,
    dataSources: () => ({
      db: new DB(),
    }),
    logger: config?.logger,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });
};
