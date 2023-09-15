import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.gql";
export const userLoginRegisterModule = createModule({
    id: "userloginregister",
    dirname: __dirname,
    typeDefs,
    resolvers,
});
