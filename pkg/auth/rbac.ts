import { Role } from "./roles";
import type { Permission } from "./permissions";

export class RBAC {
    static readonly roles: Record<Role, Permission[]> = {
        admin: [
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
        ],
        user: [],
    };

    static getPermissions(roles: Role[]): Permission[] {
        return [...new Set(roles.flatMap((r) => RBAC.roles[r]))];
    }
}
