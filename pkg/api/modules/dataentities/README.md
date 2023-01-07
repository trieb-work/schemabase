# Dataentries - main GraphQL module 
This module is used to offer the user-side access to ECI data of your own tenant. We are using a general resolver from "@paljs/plugins", that is 
making it more easy to create new endpoints that access Prisma data.
Unfortunately, we could not find a way to generate typeDefs automatically from Prisma, so there is a lot of redundant data in the schema.gql.ts