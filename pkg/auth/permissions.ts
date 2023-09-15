import { z } from "zod";
const permissions = [
    "create:order",
    "read:order",
    "update:order",
    "delete:order",

    "create:package",
    "read:package",
    "update:package",
    "delete:package",

    "create:packageEvent",
    "read:packageEvent",
    "update:packageEvent",
    "delete:packageEvent",

    "create:transactionalEmail",
    "read:transactionalEmail",
    "update:transactionalEmail",
    "delete:transactionalEmail",
] as const;

const permissionValidation = z.enum(permissions);
export const permissionsValidation = z.array(permissionValidation);

export type Permission = z.infer<typeof permissionValidation>;
