import * as Types from "../../../generated/schema-types";
import * as gm from "graphql-modules";
export namespace BaseModule {
  interface DefinedFields {
    Query: "healthCheck";
    Mutation: "_empty";
  }

  export type Query = Pick<Types.Query, DefinedFields["Query"]>;
  export type Mutation = Pick<Types.Mutation, DefinedFields["Mutation"]>;

  export type QueryResolvers = Pick<
    Types.QueryResolvers,
    DefinedFields["Query"]
  >;
  export type MutationResolvers = Pick<
    Types.MutationResolvers,
    DefinedFields["Mutation"]
  >;

  export interface Resolvers {
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
  }

  export interface MiddlewareMap {
    "*"?: {
      "*"?: gm.Middleware[];
    };
    Query?: {
      "*"?: gm.Middleware[];
      healthCheck?: gm.Middleware[];
    };
    Mutation?: {
      "*"?: gm.Middleware[];
      _empty?: gm.Middleware[];
    };
  }
}
