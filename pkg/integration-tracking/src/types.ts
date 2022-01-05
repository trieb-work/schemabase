import type { PackageState } from "@eci/pkg/prisma";
export enum Topic {
  PACKAGE_UPDATE = "tracking.package.update",
  PACKAGE_UPDATE_DONE = "tracking.package.update.success",
}

export type PackageUpdateDoneEvent = {
  packageId: string;
  shouldSendEmail: boolean;
};

export type PackageEvent = {
  trackingId: string;
  location: string;
  time: number;
  state: PackageState;
  message?: string;
};
