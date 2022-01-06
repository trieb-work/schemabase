import { PackageState } from "@prisma/client";

export enum Topic {
  PACKAGE_UPDATE = "tracking.package.update",
  PACKAGE_STATE_TRANSITION = "tracking.package.state.transition",
}

export type PackageStateTransitionEvent = {
  packageId: string;
  oldState: PackageState;
  newState: PackageState;
};

export type PackageEvent = {
  trackingId: string;
  location: string;
  time: number;
  state: PackageState;
  message?: string;
  trackingIntegrationId: string;
};
