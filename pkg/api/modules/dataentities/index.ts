import { createModule } from "graphql-modules";
import typeDefs from "./schema.gql";

import { resolvers } from "./resolvers";

export const dataEntitiesModule = createModule({
  id: "dataentities",
  dirname: __dirname,
  typeDefs,
  resolvers,
});
