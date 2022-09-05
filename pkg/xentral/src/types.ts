export interface ArtikelCreateRequest {
  projekt: number;
  name_de?: string;
  artikel?: string;
  ean?: string;
  nummer?: number | "NEW";
  aktiv?: 0 | 1;
  /**
   * 0 = kein tracking vom lagerstand
   *
   * 1 = lagerstandsüberwachung aktiviert
   */
  lagerartikel?: 0 | 1;
  /**
   * 3_kat = versandartikel
   *
   * 6_kat = sonstiges
   */
  typ?: "3_kat";
}

export interface AuftragCreateRequest {
  kundennummer: number | "NEW";
  /**
   * Vor- und Nachname
   */
  name?: string;
  typ?: "firma" | "herr" | "frau" | "sonstige";
  /**
   * Straße und Hausnummer
   */
  strasse?: string;
  /**
   * Adressline 2
   */
  adresszusatz?: string;
  plz?: string;
  /**
   * Stadt oder Dorf. Beispiel: Nürnberg
   */
  ort?: string;
  /**
   * 2 letter ISO country code
   */
  land?: string;
  artikelliste?: {
    position: {
      /**
       * Artikelname
       */
      artikel?: string;
      /**
       * Artikelnummer oder SKU
       */
      nummer?: number | string;
      preis?: number;
      menge: number;
      waehrung?: "EUR";
    }[];
  };
}

export interface AuftragCreateResponse {
  id: number;
  belegnr: string;
}

export interface ArtikelCreateResponse {
  id: number;
  nummer: string;
}

export interface GenericCreateResponse {
  status?: {
    action?: string;
    message?: "OK";
    messageCode?: 1;
  };
  xml?: any;
}
