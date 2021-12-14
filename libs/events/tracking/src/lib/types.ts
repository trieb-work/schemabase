import type { PackageState } from "@eci/data-access/prisma";

export enum Topic {
  PACKAGE_UPDATE = "tracking.package.update",
}

export type PackageEvent = {
  trackingId: string;
  location: string;
  time: string;
  state: PackageState;
  message?: string;
};
