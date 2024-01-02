import { KencoveApiAppProductSyncService } from ".";

export class SyncToOdooEDI extends KencoveApiAppProductSyncService {
    public async sync(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
