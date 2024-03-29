import { HttpError } from "@eci/pkg/errors";

export function authorizeIntegration(integration: {
    enabled: boolean;
    subscription: {
        payedUntil: Date | null;
    } | null;
}): void {
    if (!integration.enabled) {
        throw new HttpError(403, "The integration is disabled by the user");
    }
    const { subscription } = integration;
    if (
        subscription?.payedUntil == null ||
        subscription.payedUntil.getTime() < Date.now()
    ) {
        throw new HttpError(403, "Active subcription required");
    }
}
