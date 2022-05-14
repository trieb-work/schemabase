import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.gql";
export const baseModule = createModule({
  id: "base",
  dirname: __dirname,
  typeDefs,
  resolvers,
});
