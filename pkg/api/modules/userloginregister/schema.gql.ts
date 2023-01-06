import { gql } from "graphql-modules";

export default gql`
  scalar DateTime

  type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    name: String
    email: String!
    tenants: [Tenant!]
  }

  enum User_Tenant_Role {
    MEMBER
    OWNER
  }
  type Membership {
    createdAt: DateTime!
    updatedAt: DateTime!
    role: User_Tenant_Role!
  }
  type Tenant {
    id: ID!
    role: User_Tenant_Role!
    # membership:
  }
`;
