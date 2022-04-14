Graphql client for saleor.

All required mutations and queries are in `./saleor/src/api/queries/` and `./saleor/src/api/mutations/`

Currently we're using a static schema in `saleor/src/api/schema.gql` but Til wanted to download the schema dynamically using the codegen, similar to P&F
