import * as Types from "../../../generated/schema-types";
import * as gm from "graphql-modules";
export namespace TrackingModule {
    interface DefinedFields {
        Query: "packageByTrackingId";
    }

    export type Query = Pick<Types.Query, DefinedFields["Query"]>;
    export type Package = Types.Package;

    export type QueryResolvers = Pick<
        Types.QueryResolvers,
        DefinedFields["Query"]
    >;

    export interface Resolvers {
        Query?: QueryResolvers;
    }

    export interface MiddlewareMap {
        "*"?: {
            "*"?: gm.Middleware[];
        };
        Query?: {
            "*"?: gm.Middleware[];
            packageByTrackingId?: gm.Middleware[];
        };
    }
}
