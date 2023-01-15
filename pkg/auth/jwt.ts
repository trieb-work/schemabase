/* eslint-disable camelcase */
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "@eci/pkg/env";
import { Role, rolesValidation } from "./roles";
import { eci_User_Tenant_Role } from "@eci/pkg/prisma";

export const payload = z.object({
  iss: z.string(),
  iat: z.number(),
  exp: z.number().int(),
  aud: z.string(),
  sub: z.string(),
  roles: rolesValidation,
  tenants: z.array(z.object({ id: z.string(), role: z.string() })).optional(),
});

export type Claims = z.infer<typeof payload>;
export class JWT {
  private static readonly issuer = "https://auth.trieb.work";

  private static readonly audience = "https://api.trieb.work";

  private static readonly algorithm = "HS256";

  public static sign(
    subject: string,
    opts: {
      roles: Role[];
      tenants?: {
        id: string;
        role: eci_User_Tenant_Role;
      }[];
    },
  ): string {
    const secret = env.require("JWT_SIGNING_KEY");

    const { roles, tenants } = opts;

    return jwt.sign(
      {
        roles,
        tenants,
      },
      secret,
      {
        algorithm: JWT.algorithm,
        expiresIn: "1h",
        audience: JWT.audience,
        issuer: JWT.issuer,
        subject,
      },
    );
  }

  public static verify(encoded: string): Claims {
    const secret = env.require("JWT_SIGNING_KEY");
    const decoded = jwt.verify(encoded, secret, {
      audience: JWT.audience,
      issuer: JWT.issuer,
    });

    return payload.parse(decoded);
  }

  public static isValid(token: string): boolean {
    try {
      JWT.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  public static decode(token: string): Claims {
    const claims = jwt.decode(token);
    if (!claims) {
      throw new Error(`Unable to decode token: ${token}`);
    }
    if (typeof claims === "string") {
      throw new Error(`Unable to parse claims: ${claims}`);
    }
    return payload.parse(claims);
  }

  /**
   * Return in how many seconds the jwt will expire.
   *
   * Will be negative if it has expired already
   */
  public static expiresIn(token: string): number {
    const claims = JWT.decode(token);

    return claims.exp ?? 0 - Math.floor(Date.now() / 1000);
  }

  public static isExpired(token: string): boolean {
    return JWT.expiresIn(token) <= 0;
  }
}
