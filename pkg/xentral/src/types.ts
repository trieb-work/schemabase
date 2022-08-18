export interface AuftragCreateRequest {
    kundennummer: number | "NEW",
    /**
     * Vor- und Nachname
     */
    name?: string,
    typ?: 'firma' | 'herr' | 'frau' | 'sonstige',
    /**
     * Straße und Hausnummer
     */
    strasse?: string,
    /**
     * Adressline 2
     */
    adresszusatz?: string, 
    plz?: string,
    /**
     * Stadt oder Dorf. Beispiel: Nürnberg
     */
    ort?: string,
    /**
     * 2 letter ISO country code
     */
    land?: string,
    artikelliste?: {
        position: {
            /**
             * Artikelname
             */
            artikel?: string,
            /**
             * Artikelnummer oder SKU
             */
            nummer?: number | string, 
            preis?: number, 
            menge: number, 
            waehrung?: "EUR"
        }[]
    }
}

export interface AuftragCreateResponse {
    id: number,
    belegnr: string,
}

export interface GenericCreateResponse {
    status?: {
        action?: string,
        message?: 'OK',
        messageCode?: 1
    },
    xml?: any
}