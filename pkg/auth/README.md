Offers role based authorization for the internal graphql api.

Permissions are managed in `permissions.ts` and the mapping of what each role is allowed to do is done in `rbac.ts`
Inside the jwt will be the role name only.