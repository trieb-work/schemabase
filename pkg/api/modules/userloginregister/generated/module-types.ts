import * as Types from "../../../generated/schema-types";
import * as gm from "graphql-modules";
export namespace UserloginregisterModule {
    interface DefinedFields {
        Mutation: "signup" | "login";
        AuthPayload: "token" | "user";
        User: "id" | "name" | "email" | "tenants";
        Membership: "createdAt" | "updatedAt" | "role";
        Tenant: "id" | "role";
    }

    interface DefinedEnumValues {
        User_Tenant_Role: "MEMBER" | "OWNER";
    }

    export type Mutation = Pick<Types.Mutation, DefinedFields["Mutation"]>;
    export type AuthPayload = Pick<
        Types.AuthPayload,
        DefinedFields["AuthPayload"]
    >;
    export type User = Pick<Types.User, DefinedFields["User"]>;
    export type Tenant = Pick<Types.Tenant, DefinedFields["Tenant"]>;
    export type User_Tenant_Role = DefinedEnumValues["User_Tenant_Role"];
    export type Membership = Pick<
        Types.Membership,
        DefinedFields["Membership"]
    >;

    export type Scalars = Pick<Types.Scalars, "DateTime">;
    export type DateTimeScalarConfig = Types.DateTimeScalarConfig;

    export type MutationResolvers = Pick<
        Types.MutationResolvers,
        DefinedFields["Mutation"]
    >;
    export type AuthPayloadResolvers = Pick<
        Types.AuthPayloadResolvers,
        DefinedFields["AuthPayload"] | "__isTypeOf"
    >;
    export type UserResolvers = Pick<
        Types.UserResolvers,
        DefinedFields["User"] | "__isTypeOf"
    >;
    export type MembershipResolvers = Pick<
        Types.MembershipResolvers,
        DefinedFields["Membership"] | "__isTypeOf"
    >;
    export type TenantResolvers = Pick<
        Types.TenantResolvers,
        DefinedFields["Tenant"] | "__isTypeOf"
    >;

    export interface Resolvers {
        Mutation?: MutationResolvers;
        AuthPayload?: AuthPayloadResolvers;
        User?: UserResolvers;
        Membership?: MembershipResolvers;
        Tenant?: TenantResolvers;
        DateTime?: Types.Resolvers["DateTime"];
    }

    export interface MiddlewareMap {
        "*"?: {
            "*"?: gm.Middleware[];
        };
        Mutation?: {
            "*"?: gm.Middleware[];
            signup?: gm.Middleware[];
            login?: gm.Middleware[];
        };
        AuthPayload?: {
            "*"?: gm.Middleware[];
            token?: gm.Middleware[];
            user?: gm.Middleware[];
        };
        User?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            name?: gm.Middleware[];
            email?: gm.Middleware[];
            tenants?: gm.Middleware[];
        };
        Membership?: {
            "*"?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            role?: gm.Middleware[];
        };
        Tenant?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            role?: gm.Middleware[];
        };
    }
}
