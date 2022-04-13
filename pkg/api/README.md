Graphql API hosted inside the nextjs api service to get or create data in the eci database  

Using graphql-modules and apollo server

# Adding a new module:

1. `cp -r ./pkg/api/modules/base ./pkg/api/modules/<MY_MODULE>`
2. Edit `id` in `index.ts` // Maybe replacing this with `__dirname` works as well..
3. Edit `schema.gql.ts` and `resolvers.ts`
4. Add new module in `./pkg/api/application.ts`