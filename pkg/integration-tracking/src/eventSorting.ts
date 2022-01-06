import { PackageState } from "@prisma/client";

/**
 * Transitions from one state (the key) to its possible next states (the array)
 */
const newsWorthyTransitions: Record<PackageState, PackageState[]> = {
  // Initial state when the package is created
  INIT: [
    PackageState.INFORMATION_RECEIVED,
    PackageState.IN_TRANSIT,
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The carrier has received the shipment info and is about to pick up the package.
  INFORMATION_RECEIVED: [
    PackageState.IN_TRANSIT,
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The shipment has been accepted and is in transit now.
  IN_TRANSIT: [
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The carrier is on its way to deliver the shipment.
  OUT_FOR_DELIVERY: [
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The carrier attemptet to deliver the shipment but failed. It ususlly leavesa notice and will try to deliver again.
  FAILED_ATTEMPT: [
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The shipment has been delivered successfully.
  DELIVERED: [],
  // The package has arrived at the nearest pickup point and is available for pickup.
  AVAILABLE_FOR_PICKUP: [],
  // Held at customs, undelivered, returned to sender, or any other shipping exceptions.
  EXCEPTION: [],
  // The shipment has expired as the carrier didn't return the tracking info for the lat 30 days.
  EXPIRED: [
    PackageState.IN_TRANSIT,
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
  // The shipment is pending as the carrier didn't return the tracking info.
  PENDING: [
    PackageState.IN_TRANSIT,
    PackageState.OUT_FOR_DELIVERY,
    PackageState.FAILED_ATTEMPT,
    PackageState.DELIVERED,
    PackageState.AVAILABLE_FOR_PICKUP,
    PackageState.EXCEPTION,
  ],
};
/**
 * Decide if the next event should trigger a notification for the user.
 */
export function shouldNotify(
  current: PackageState,
  next: PackageState,
): boolean {
  return newsWorthyTransitions[current].includes(next);
}
