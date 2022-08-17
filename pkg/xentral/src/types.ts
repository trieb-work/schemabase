export interface AuftragCreateRequest {
    kundennummer: number | "NEW",
    artikelliste: {
        position: {
            /**
             * SKU oder Artikelname
             */
            artikel?: string,
            /**
             * Artikelnummer
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