type StrapiEntryStandard = {
  id: number,
  created_at: string,
  updated_at: string,
}

interface StrapiOrderEntry extends StrapiEntryStandard {
  Status: string,
  zohoCustomerId: string,
}

export type StrapiOrdersToZohoConfig = { 
  event: "entry.update" | "entry.create",
  created_at: string,
  model: "auftrag",
  entry: StrapiOrderEntry
};
export class integrationsStrapiOrdersToZoho {
  public readonly entry: StrapiOrderEntry 

  public readonly status: string

  public constructor(config: StrapiOrdersToZohoConfig) {
    this.entry = config.entry;
    this.status = config.entry.Status;
  }

  public async createOrUpdate() {
    switch (this.status) {
      case "Draft":
        
        break;
    
      case "Confirmed":
        break;  
      default:
        break;
    }
  };
 
}

