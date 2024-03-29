import { Claims, JWT } from "@eci/pkg/auth";
import { ILogger, Logger } from "@eci/pkg/logger";
import { AuthenticationError, AuthorizationError } from "@eci/pkg/errors";
import { z } from "zod";
import { Permission, permissionsValidation, RBAC } from "../auth";
import { DB, DataSources } from "./datasources";
import { NextApiRequest } from "next";

export interface Context {
    dataSources: DataSources;
    authenticateUser: () => Promise<Claims>;
    authorizeUser: (
        requiredPermissions: z.infer<typeof permissionsValidation>,
        authorizer?: (claims: Claims) => void | Promise<void>,
    ) => Promise<Claims>;
    logger: ILogger;
    currentUserId: string | null;
}

export const context = async (ctx: NextApiRequest) => {
    const logger = new Logger();
    const authenticateUser = async (): Promise<Claims> => {
        const token = ctx.headers?.authorization;
        if (!token) {
            throw new AuthenticationError("missing authorization header");
        }
        if (!token.startsWith("Bearer ")) {
            throw new AuthenticationError(
                "Authorization is not a bearer token",
            );
        }
        try {
            return JWT.verify(token.replace("Bearer ", ""));
        } catch (err) {
            logger.error((err as Error).message);
            throw new AuthenticationError("Unable to verify token");
        }
    };

    const authorizeUser = async (
        requiredPermissions: Permission[],
        authorize?: (claims: Claims) => void | Promise<void>,
    ): Promise<Claims> => {
        const claims = await authenticateUser();

        const permissions = RBAC.getPermissions(claims.roles);
        for (const requiredPermission of requiredPermissions) {
            if (!permissions.includes(requiredPermission)) {
                throw new AuthorizationError(
                    `You do not have sufficient permissions, you require ${requiredPermission}`,
                );
            }
        }
        if (authorize != null) {
            try {
                await authorize(claims);
            } catch (err) {
                if (err instanceof AuthorizationError) {
                    throw err;
                }
                throw new AuthorizationError(
                    `Unauthorized: ${(err as Error).message} - ${JSON.stringify(
                        claims,
                    )}`,
                );
            }
        }
        return claims;
    };

    return {
        ...ctx,
        authenticateUser,
        authorizeUser,
        logger,
        dataSources: { db: new DB() },
        currentUserId: null,
    };
};
