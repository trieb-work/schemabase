import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.gql";
export const trackingModule = createModule({
    id: "tracking",
    dirname: __dirname,
    typeDefs,
    resolvers,
});
