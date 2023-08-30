import { ILogger } from "@eci/pkg/logger";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { application } from "./application";
import { Context, context } from "./context";
export interface ServerConfig {
  logger?: ILogger;
}

const server = new ApolloServer<Context>({
  schema: application.schema,
  introspection: true,
  plugins: [],
});

export default startServerAndCreateNextHandler(server, { context });
