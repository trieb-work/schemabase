import { ArtikelTypeEnum } from "../types";

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
  typ?: ArtikelTypeEnum;
  /**
   * Artikelbeschreibung
   */
  anabregs_text?: string;
  /**
   * Wenn dieser Artikel ein Product-Variant ist dann kann hier die nummer des Parent-Product übergeben werden
   */
  variante_von_nummer?: number | string;

  leerfeld?: string;
  adresse?: string;
  ishtml_cke_anabregs_text?: 1 | 0;
  kurztext_de?: string;
  internerkommentar?: string;
  zolltarifnummer?: string;
  herkunftsland?: string;
  ursprungsregion?: string;
  mindestlager?: number;
  gewicht?: string;
  mindestbestellung?: number;
  nettogewicht?: string;
  lager_platz?: string;
  laenge?: "0,00";
  einheit?: string;
  breite?: "0,00";
  xvp?: number;
  hoehe?: "0,00";
  abckategorie?: string;
  rabatt_prozent?: string;
  variante_von?: string;
  umsatzsteuer?: "normal";
  steuersatz?: string;
  chargenverwaltung?: number;
  seriennummern?: "keine";
  inventurek?: "0,00";
  berechneterek?: "0,00";
  berechneterekwaehrung?: string;
  altersfreigabe?: string;
  stueckliste?: 1 | 0;
  juststueckliste?: 1 | 0;
  preproduced_partlist?: string;
  formelmenge?: string;
  formelpreis?: string;
  intern_gesperrtgrund?: string;
  hinweis_einfuegen?: string;
  freigaberegel?: string;
  kurztext_en?: string;
  artikelbeschreibung_de_anzeige?: string;
  anabregs_text_en?: string;
  ishtml_cke_anabregs_text_en?: 1 | 0;
  uebersicht_de?: string;
  ishtml_cke_uebersicht_de?: 1 | 0;
  uebersicht_en?: string;
  ishtml_cke_uebersicht_en?: 1 | 0;
  metatitle_de?: string;
  metatitle_en?: string;
  metadescription_de?: string;
  metadescription_en?: string;
  metakeywords_de?: string;
  metakeywords_en?: string;
  katalogbezeichnung_de?: string;
  katalogbezeichnung_en?: string;
  katalogtext_de?: string;
  katalogtext_en?: string;
  freifeld1?: string;
  freifeld2?: string;
  freifeld3?: string;
  freifeld4?: string;
  freifeld5?: string;
  freifeld6?: string;
  freifeld7?: string;
  freifeld8?: string;
  freifeld9?: string;
  freifeld10?: string;
  freifeld11?: string;
  freifeld12?: string;
  freifeld13?: string;
  freifeld14?: string;
  freifeld15?: string;
  freifeld16?: string;
  freifeld17?: string;
  freifeld18?: string;
  freifeld19?: string;
  freifeld20?: string;
  freifeld21?: string;
  freifeld22?: string;
  freifeld23?: string;
  freifeld24?: string;
  freifeld25?: string;
  freifeld26?: string;
  freifeld27?: string;
  freifeld28?: string;
  freifeld29?: string;
  freifeld30?: string;
  freifeld31?: string;
  freifeld32?: string;
  freifeld33?: string;
  freifeld34?: string;
  freifeld35?: string;
  freifeld36?: string;
  freifeld37?: string;
  freifeld38?: string;
  freifeld39?: string;
  freifeld40?: string;
  artikel_onlineshops_length?: number;
  pseudolager?: string;
  lieferzeitmanuell?: string;
  bestandalternativartikel?: string;
  lagerkorrekturwert?: number;
  pseudopreis?: "0,00";
  steuer_erloese_inland_normal?: string;
  steuer_aufwendung_inland_normal?: string;
  steuer_erloese_inland_ermaessigt?: string;
  steuer_aufwendung_inland_ermaessigt?: string;
  steuer_erloese_inland_nichtsteuerbar?: string;
  steuer_aufwendung_inland_nichtsteuerbar?: string;
  steuer_erloese_inland_innergemeinschaftlich?: string;
  steuertext_innergemeinschaftlich?: string;
  steuer_aufwendung_inland_innergemeinschaftlich?: string;
  steuer_erloese_inland_eunormal?: string;
  steuer_aufwendung_inland_eunormal?: string;
  steuer_erloese_inland_euermaessigt?: string;
  steuer_aufwendung_inland_euermaessigt?: string;
  steuer_erloese_inland_export?: string;
  steuertext_export?: string;
  steuer_aufwendung_inland_import?: string;
  kostenstelle?: string;
}
export interface ArtikelCreateResponse {
  id: number;
  nummer: string;
}

export interface StuecklisteEditRequest {
  eid?: string;
  /**
   * The id of the article you want to add a bill of material
   */
  estartikelid: number;

  /**
   * The BOM part item. It might work with the SKU only
   */
  eartikel: string;
  emenge: number;
  eart?: "et";
  ereferenz?: string;
  elayer?: "Top";
  eplace?: string;
  ewert?: string;
  ebauform?: string;
  ezachse?: string;
  expos?: string;
  eypos?: string;
}

export type AuftragEditRequest = Omit<AuftragCreateRequest, "nummer"> & {
  id: number;
  nummer?: number | string;
};
export type AuftragEditResponse = AuftragCreateResponse;

export type ArtikelEditRequest = Omit<ArtikelCreateRequest, "nummer"> & {
  id: string;
  nummer?: number | string;
};
export type ArtikelEditResponse = ArtikelCreateResponse;
export type ArtikelGetRequest = {
  id: string;
};
export type ArtikelGetResponse = ArtikelCreateResponse;

export interface AuftragCreateRequest {
  kundennummer: number | "NEW";
  /**
   * Vor- und Nachname
   */
  name?: string;
  titel?: string;
  telefon?: string;
  telefax?: string;
  email?: string;
  ansprechpartner?: string;
  abteilung?: string;
  unterabteilung?: string;
  anschreiben?: string;
  freitext?: string;
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
  bundesstaat?: string;
  /**
   * 2 letter ISO country code
   * @example "DE", "EN"
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
      preis?: number | string;
      menge: number;
      waehrung?: "EUR";
    }[];
  };
  /**
   * Order number - used for example for drop shipping
   */
  ihrebestellnummer?: string;

  status?:
    | "angelegt"
    | "bestellt"
    | "freigegeben"
    | "versendet"
    | "abgeschlossen"
    | "storniert";
  lieferid?: number;
  ansprechpartnerid?: number;
  uebernehmen?: 0 | 1;
  lieferant?: string;
  uebernehmen2?: number;
  projekt?: string | "STANDARD";
  aktion?: string;
  internet?: string;
  angebotid?: string;
  kundennummer_buchhaltung?: string;
  internebezeichnung?: string;
  auftragseingangper?: "internet";
  /**
   * Datestring in format dd.MM.yyy
   * @example "23.09.2022"
   */
  datum?: string;
  /**
   * Datestring in format dd.MM.yyy
   * @example "23.09.2022"
   */
  lieferdatum?: string;
  /**
   * Datestring in format dd.MM.yyy
   * @example "23.09.2022"
   */
  tatsaechlicheslieferdatum?: string;
  /**
   * Datestring in format dd.MM.yyy
   * @example "23.09.2022"
   */
  reservationdate?: string;
  kommissionskonsignationslager?: number;
  ishtml_cke_freitext?: 1 | 0;
  bodyzusatz?: string;
  ishtml_cke_bodyzusatz?: 1 | 0;
  zahlungsweise?: "rechnung";
  versandart?: "DHL" | "DPD" | string;
  lieferbedingung?: string;
  vertrieb?: string;
  bearbeiter?: string;
  autoversand?: 1 | 0;
  art?: "standardauftrag";
  gln?: string;
  zahlungszieltage?: 14;
  zahlungszieltageskonto?: 10;
  /**
   * Datestring in format dd.MM.yyy
   * @example "23.09.2022"
   */
  einzugsdatum?: string;
  kreditkarte_typ?: "MasterCard";
  kreditkarte_inhaber?: string;
  kreditkarte_nummer?: string;
  kreditkarte_pruefnummer?: string;
  kreditkarte_monat?: number;
  kreditkarte_jahr?: number;
  zahlungszielskonto?: number;
  internebemerkung?: string;
  ishtml_cke_internebemerkung?: 1 | 0;
  ustid?: string;
  ust_befreit?: number;
  ust_ok?: 1;
  anzeigesteuer?: number;
  waehrung?: "EUR";
  sprache?: "deutsch";
  kurs?: number;
  kostenstelle?: string;
}

export interface AuftragCreateResponse {
  id: number;
  belegnr: string;
}

export interface GenericCreateResponse {
  status?: {
    action?: string;
    message?: "OK";
    messageCode?: 1;
  };
  xml?: any;
}
