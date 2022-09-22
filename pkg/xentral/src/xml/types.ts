export interface ArtikelCreateRequest {
  projekt: number;
  name_de?: string;
  name_en?: string;
  hersteller?: string;
  herstellerlink?: string;
  herstellernummer?: string;
  ean?: string;
  nummer: number | string | "NEW";
  /**
   * can also be used for ArtikelGet, could be SKU for example
   */
  kundennummer?: number | string;
  /**
   * 1 = aktiv
   * 0 = inaktiv
   */
  aktiv?: 1 | 0;
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
  typ?: "3_kat" | "6_kat";
  /**
   * Artikelbeschreibung
   */
  anabregs_text?: string;
  /**
   * Wenn dieser Artikel ein Product-Variant ist dann kann hier die nummer des Parent-Product übergeben werden
   */
  variante_von_nummer?: number | string;


  // leerfeld: 
  // name_de: Grußkarten-Set "Pyjama" (5 Karten + Kuverts)
  // adresse: 
  // ishtml_cke_anabregs_text: 1
  // kurztext_de: 
  // internerkommentar: 
  // zolltarifnummer: 
  // herkunftsland: 
  // ursprungsregion: 
  // mindestlager: 0
  // gewicht: 
  // mindestbestellung: 0
  // nettogewicht: 
  // lager_platz: 
  // laenge: 0,00
  // einheit: 
  // breite: 0,00
  // xvp: 0.00
  // hoehe: 0,00
  // abckategorie: 
  // lagerartikel: 1
  // rabatt_prozent: 
  // variante_von: 
  // umsatzsteuer: normal
  // steuersatz: 
  // chargenverwaltung: 0
  // seriennummern: keine
  // inventurek: 0,00
  // berechneterek: 0,00
  // berechneterekwaehrung: 
  // altersfreigabe: 
  // preproduced_partlist: 
  // formelmenge: 
  // formelpreis: 
  // intern_gesperrtgrund: 
  // hinweis_einfuegen: 
  // freigaberegel: 
  // name_en: 
  // kurztext_en: 
  // artikelbeschreibung_de_anzeige: 
  // anabregs_text_en: 
  // ishtml_cke_anabregs_text_en: 1
  // uebersicht_de: 
  // ishtml_cke_uebersicht_de: 1
  // uebersicht_en: 
  // ishtml_cke_uebersicht_en: 1
  // metatitle_de: 
  // metatitle_en: 
  // metadescription_de: 
  // metadescription_en: 
  // metakeywords_de: 
  // metakeywords_en: 
  // katalogbezeichnung_de: 
  // katalogbezeichnung_en: 
  // katalogtext_de: 
  // katalogtext_en: 
  // freifeld1: 
  // freifeld2: 
  // freifeld3: 
  // freifeld4: 
  // freifeld5: 
  // freifeld6: 
  // freifeld7: 
  // freifeld8: 
  // freifeld9: 
  // freifeld10: 
  // freifeld11: 
  // freifeld12: 
  // freifeld13: 
  // freifeld14: 
  // freifeld15: 
  // freifeld16: 
  // freifeld17: 
  // freifeld18: 
  // freifeld19: 
  // freifeld20: 
  // freifeld21: 
  // freifeld22: 
  // freifeld23: 
  // freifeld24: 
  // freifeld25: 
  // freifeld26: 
  // freifeld27: 
  // freifeld28: 
  // freifeld29: 
  // freifeld30: 
  // freifeld31: 
  // freifeld32: 
  // freifeld33: 
  // freifeld34: 
  // freifeld35: 
  // freifeld36: 
  // freifeld37: 
  // freifeld38: 
  // freifeld39: 
  // freifeld40: 
  // artikel_onlineshops_length: 10
  // pseudolager: 
  // lieferzeitmanuell: 
  // bestandalternativartikel: 
  // lagerkorrekturwert: 0
  // pseudopreis: 0,00
  // steuer_erloese_inland_normal: 
  // steuer_aufwendung_inland_normal: 
  // steuer_erloese_inland_ermaessigt: 
  // steuer_aufwendung_inland_ermaessigt: 
  // steuer_erloese_inland_nichtsteuerbar: 
  // steuer_aufwendung_inland_nichtsteuerbar: 
  // steuer_erloese_inland_innergemeinschaftlich: 
  // steuertext_innergemeinschaftlich: 
  // steuer_aufwendung_inland_innergemeinschaftlich: 
  // steuer_erloese_inland_eunormal: 
  // steuer_aufwendung_inland_eunormal: 
  // steuer_erloese_inland_euermaessigt: 
  // steuer_aufwendung_inland_euermaessigt: 
  // steuer_erloese_inland_export: 
  // steuertext_export: 
  // steuer_aufwendung_inland_import: 
  // kostenstelle: 
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
