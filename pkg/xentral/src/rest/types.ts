import { ArtikelTypeEnum } from "../types";

export type AllowedMethod = "GET" | "POST" | "PUT" | "DELETE";
export type AllowedSubRoutes = "/v1/aboartikel" |
  "/v1/abogruppen" |
  "/v1/adressen" |
  "/v1/adressen" |
  "/v1/adressen/{id}" |
  "/v2/adressen" |
  "/v1/adresstyp" |
  "/v1/artikel" |
  "/v1/artikel" |
  "/v1/artikel/{id}" |
  "/v1/artikelkategorien" |
  "/v1/eigenschaften" |
  "/v1/eigenschaftenwerte" |
  "/v1/belege/angebote" |
  "/v1/belege/auftraege" |
  "/v1/belege/lieferscheine" |
  "/v1/belege/rechnungen" |
  "/v1/belege/gutschriften" |
  "/v1/crmdokumente" |
  "/v1/dateien" |
  "/v1/docscan" |
  "/v1/gruppen" |
  "/v1/laender" |
  "/v1/storage" |
  "/v1/storage/bin" |
  "/v1/lagercharge" |
  "/v1/lagermhd" |
  "/v1/lieferadressen" |
  "/v1/reports" |
  "/v1/steuersaetze" |
  "/v1/trackingnummern" |
  "/v1/versandarten" |
  "/v1/wiedervorlagen" |
  "/v1/zahlungsweisen";

export type NormalRes<Res> = {
  data: Res,
}
export type PaginatedRes<Res> = {
  data: Res[],
  pagination: {
      items_per_page: number,
      items_current: number,
      items_total: number,
      page_current: number,
      page_last: number,
  }
}
export type PaginatedParams<Req> = Req & {
  /**
   * Seitenzahl
   * 
   * default: 1, maximum: 1000
   */
  page?: number;
  /**
   * Anzahl der Ergebnisse pro Seite
   * 
   * default: 20, maximum: 1000
   */
  items?: number;
}
export interface Artikel {
  "id": number,
  "typ": ArtikelTypeEnum,
  "nummer": string,
  "checksum": string,
  "projekt": number,
  "inaktiv": 0 | 1,
  "ausverkauft": 0 | 1,
  "warengruppe": string,
  "name_de": string,
  "name_en": string,
  "kurztext_de": string,
  "kurztext_en": string,
  "beschreibung_de": string,
  "beschreibung_en": string,
  "uebersicht_de": string,
  "uebersicht_en": string,
  "links_de": string,
  "links_en": string,
  "startseite_de": string,
  "startseite_en": string,
  "standardbild": string,
  "herstellerlink": string,
  "hersteller": string,
  "teilbar": string,
  "nteile": string,
  "seriennummern": string,
  "lager_platz": string,
  "lieferzeit": string,
  "lieferzeitmanuell": string,
  "sonstiges": string,
  "gewicht": string,
  "endmontage": string,
  "funktionstest": string,
  "artikelcheckliste": string,
  "stueckliste": 0 | 1,
  "juststueckliste": 0 | 1,
  "barcode": string,
  "hinzugefuegt": string,
  "pcbdecal": string,
  "lagerartikel": 1 | 0,
  "porto": 0 | 1,
  "chargenverwaltung": 0 | 1,
  "provisionsartikel": 0 | 1,
  "gesperrt": 0 | 1,
  "sperrgrund": string,
  "geloescht": 0 | 1,
  /**
   * datestring: "YyYYY-mm-DD"
   */
  "gueltigbis": string,
  "umsatzsteuer": string,
  "klasse": string,
  "adresse": 0 | 1,
  "shopartikel": 0 | 1,
  "unishopartikel": 0 | 1,
  "journalshopartikel": 0 | 1,
  "katalog": 0 | 1,
  "katalogtext_de": string,
  "katalogtext_en": string,
  "katalogbezeichnung_de": string,
  "katalogbezeichnung_en": string,
  "neu": 0 | 1,
  "topseller": 0 | 1,
  "startseite": 0 | 1,
  "wichtig": 0 | 1,
  "mindestlager": 0 | 1,
  "mindestbestellung": 0 | 1,
  "partnerprogramm_sperre": 0 | 1,
  "internerkommentar": string,
  "intern_gesperrt": 0 | 1,
  "intern_gesperrtgrund": string,
  "inbearbeitung": 0 | 1,
  "cache_lagerplatzinhaltmenge": number,
  "internkommentar": string,
  "firma": 1,
  /**
   * datetimestring: "YyYYY-mm-DD HH:MM:SS"
   */
  "logdatei": "2022-09-22 12:29:05",
  "anabregs_text": null,
  "autobestellung": 0 | 1,
  "produktion": null,
  "herstellernummer": null,
  "restmenge": null,
  "mlmdirektpraemie": null,
  "keineeinzelartikelanzeigen": 0 | 1,
  "mindesthaltbarkeitsdatum": 0 | 1,
  "letzteseriennummer": string,
  "individualartikel": 0 | 1,
  "keinrabatterlaubt": null,
  "rabatt": 0 | 1,
  "rabatt_prozent": null,
  "geraet": 0 | 1,
  "serviceartikel": 0 | 1,
  "autoabgleicherlaubt": 0 | 1,
  "pseudopreis": null,
  "freigabenotwendig": 0 | 1,
  "freigaberegel": string,
  "nachbestellt": null,
  "ean": string,
  "mlmpunkte": string,
  "mlmbonuspunkte": string,
  "mlmkeinepunkteeigenkauf": null,
  "einheit": string,
  "webid": string,
  "lieferzeitmanuell_en": null,
  "variante": null,
  "variante_von": null,
  "produktioninfo": null,
  "sonderaktion": null,
  "sonderaktion_en": null,
  "autolagerlampe": 0 | 1,
  "leerfeld": null,
  "zolltarifnummer": string,
  "herkunftsland": string,
  "laenge": string,
  "breite": string,
  "hoehe": string,
  "gebuehr": 0 | 1,
  "pseudolager": string,
  "downloadartikel": 0 | 1,
  "matrixprodukt": 0 | 1,
  "steuer_erloese_inland_normal": string,
  "steuer_aufwendung_inland_normal": string,
  "steuer_erloese_inland_ermaessigt": string,
  "steuer_aufwendung_inland_ermaessigt": string,
  "steuer_erloese_inland_steuerfrei": string,
  "steuer_aufwendung_inland_steuerfrei": string,
  "steuer_erloese_inland_innergemeinschaftlich": string,
  "steuer_aufwendung_inland_innergemeinschaftlich": string,
  "steuer_erloese_inland_eunormal": string,
  "steuer_erloese_inland_nichtsteuerbar": string,
  "steuer_erloese_inland_euermaessigt": string,
  "steuer_aufwendung_inland_nichtsteuerbar": string,
  "steuer_aufwendung_inland_eunormal": string,
  "steuer_aufwendung_inland_euermaessigt": string,
  "steuer_erloese_inland_export": string,
  "steuer_aufwendung_inland_import": string,
  "steuer_art_produkt": 1,
  "steuer_art_produkt_download": 1,
  "metadescription_de": string,
  "metadescription_en": string,
  "metakeywords_de": string,
  "metakeywords_en": string,
  "anabregs_text_en": string,
  "externeproduktion": 0 | 1,
  "bildvorschau": "KEINBILD",
  "inventursperre": 0 | 1,
  "variante_kopie": 0 | 1,
  "unikat": 0 | 1,
  "generierenummerbeioption": 0 | 1,
  "allelieferanten": 0 | 1,
  "tagespreise": 0 | 1,
  "rohstoffe": 0 | 1,
  "ohnepreisimpdf": 0 | 1,
  "provisionssperre": null,
  "dienstleistung": 0 | 1,
  "inventurekaktiv": 0 | 1,
  "inventurek": null,
  "hinweis_einfuegen": string,
  "etikettautodruck": 0 | 1,
  "lagerkorrekturwert": 0 | 1,
  "autodrucketikett": 0 | 1,
  "steuertext_innergemeinschaftlich": null,
  "steuertext_export": null,
  "formelmenge": string,
  "formelpreis": string,
  "ursprungsregion": string,
  "bestandalternativartikel": 0 | 1,
  "metatitle_de": string,
  "metatitle_en": string,
  "vkmeldungunterdruecken": 0 | 1,
  "altersfreigabe": string,
  "unikatbeikopie": 0 | 1,
  "steuergruppe": 0 | 1,
  "keinskonto": 0 | 1,
  "berechneterek": "0.0000",
  "verwendeberechneterek": 0 | 1,
  "berechneterekwaehrung": string,
  "artikelautokalkulation": 0 | 1,
  "artikelabschliessenkalkulation": 0 | 1,
  "artikelfifokalkulation": 0 | 1,
  "freifeld1": string,
  "freifeld2": string,
  "freifeld3": string,
  "freifeld4": string,
  "freifeld5": string,
  "freifeld6": string,
  "freifeld7": string,
  "freifeld8": string,
  "freifeld9": string,
  "freifeld10": string,
  "freifeld11": string,
  "freifeld12": string,
  "freifeld13": string,
  "freifeld14": string,
  "freifeld15": string,
  "freifeld16": string,
  "freifeld17": string,
  "freifeld18": string,
  "freifeld19": string,
  "freifeld20": string,
  "freifeld21": string,
  "freifeld22": string,
  "freifeld23": string,
  "freifeld24": string,
  "freifeld25": string,
  "freifeld26": string,
  "freifeld27": string,
  "freifeld28": string,
  "freifeld29": string,
  "freifeld30": string,
  "freifeld31": string,
  "freifeld32": string,
  "freifeld33": string,
  "freifeld34": string,
  "freifeld35": string,
  "freifeld36": string,
  "freifeld37": string,
  "freifeld38": string,
  "freifeld39": string,
  "freifeld40": string,
}
export interface Trackingnummer {
  "id": number,
  "tracking": string,
  "adresse": number,
  "internet": string,
  "auftrag": string,
  "lieferschein": string,
  "projekt": number,
  "versandart": string,
  "land": string,
  "gewicht": string,
  "abgeschlossen": 0 | 1,
  "versendet_am": string,
  "anzahlpakete": number,
  "retoure": 0 | 1,
  "klaergrund": string,
}
export interface AuftragParams {
  /**
   * Suche nach Auftragssstatus (genaue Übereinstimmung)
   */
  status?: "angelegt" | "bestellt" | "freigegeben" | "versendet" | "abgeschlossen" | "storniert";
  /**
   * Suche nach Belegnummer (ungefähre Übereinstimmung)
   */
  belegnr?: string;

  /**
   * Suche nach Belegnummer (genaue Übereinstimmung)
   */
  belegnr_equals?: string;

  /**
   * Suche nach Belegnummer (Übereinstimmung am Anfang)
   */
  belegnr_startswith?: string;

  /**
   * Suche nach Belegnummer (Übereinstimmung am Ende)
   */
  belegnr_endswith?: string;

  /**
   * Suche nach Kundennummer (ungefähre Übereinstimmung)
   */
  kundennummer?: string;

  /**
   * Suche nach Kundennummer (genaue Übereinstimmung)
   */
  kundennummer_equals?: string;

  /**
   * Suche nach Kundennummer (Übereinstimmung am Anfang)
   */
  kundennummer_startswith?: string;

  /**
   * Suche nach Kundennummer (Übereinstimmung am Ende)
   */
  kundennummer_endswith?: string;

  /**
   * Suche nach bestimmtem Belegdatum (genaue Übereinstimmung)
   * 
   * Format: "yyyy-MM-dd"
   * @example "2019-06-28"
   */
  datum?: string;

  /**
   * Suche nach bestimmtem Belegdatum (Datum größer Suchwert)
   * 
   * Format: "yyyy-MM-dd"
   * @example "2019-06-28"
   */
  datum_gt?: string;

  /**
   * Suche nach bestimmtem Belegdatum (Datum größer gleich Suchwert)
   * 
   * Format: "yyyy-MM-dd"
   * @example "2019-06-28"
   */
  datum_gte?: string;

  /**
   * Suche nach bestimmtem Belegdatum (Datum kleiner Suchwert)
   * 
   * Format: "yyyy-MM-dd"
   * @example "2019-06-28"
   */
  datum_lt?: string;

  /**
   * Suche nach bestimmtem Belegdatum (Datum kleiner gleich Suchwert)
   * 
   * Format: "yyyy-MM-dd"
   * @example "2019-06-28"
   */
  datum_lte?: string;

  /**
   * Aufträge nach Angebotsnummer filtern (genaue Übereinstimmung)
   */
  angebot?: string;

  /**
   * Aufträge nach Angebots-ID filtern (genaue Übereinstimmung)
   */
  angebotid?: number;

  /**
   * Aufträge eines bestimmten Projekt filtern
   */
  projekt?: number;

  /**
   * Sortierung (Beispiel: sort=belegnr)
   */
  sort?: "belegnr" | "datum";

  /**
   * Unter-Resourcen in Resource einbinden (Beispiel: include=positionen)
   */
  include?: "positionen" | "protokoll";
}
export interface Auftrag {
  "id": number;
  "firma": number;
  /**
   * projekt number formatted as string 
   * @example "1"
   */
  "projekt": string;
  "status": string | "freigegeben";
  /**
   * formatted as string:
   * @example "200000"
   */
  "belegnr": string;
  /**
   * formatted as string:
   * @example "100000"
   */
  "kundennummer": string;
  "lieferantenauftrag": 0 | 1;
  "lieferant": number;
  "aktion": string;
  "angebot": string;
  /**
   * Internal Order Number set by User
   * @example "SO-1234"
   */
  "ihrebestellnummer": string;
  "internet": string;
  "internebezeichnung": string;
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "datum": string;
  /**
   * date string;
   * @example "2022-08-17"
   */
  "lieferdatum": string;
  "lieferdatumkw": 0,
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "tatsaechlicheslieferdatum": string;
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "reservationdate": string;
  "abweichendebezeichnung": 0 | 1;
  "adresse": number;
  "typ": string;
  "name": "Administrator";
  "titel": string;
  "ansprechpartnerid": 0;
  "ansprechpartner": string;
  "abteilung": string;
  "unterabteilung": string;
  "adresszusatz": string;
  "strasse": string;
  "plz": string;
  "ort": string;
  "land": string;
  "bundesstaat": string;
  "telefon": string;
  "telefax": string;
  "email": string;
  "anschreiben": string;
  "gesamtsumme": "0.00";
  "erloes_netto": "0.00";
  "umsatz_netto": "0.00";
  "lager_ok": 1 | 0;
  "porto_ok": 1 | 0;
  "ust_ok": 1 | 0;
  "check_ok": 1 | 0;
  "vorkasse_ok":1 | 0;
  "nachnahme_ok": 1 | 0;
  "reserviert_ok": 1 | 0;
  "partnerid": number;
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "folgebestaetigung": string;
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "zahlungsmail": string;
  "liefertermin_ok": 1 | 0,
  "teillieferung_moeglich": 0,
  "kreditlimit_ok": 1 | 0,
  "kreditlimit_freigabe": 0,
  "liefersperre_ok": 1 | 0,
  "teillieferungvon": number,
  "teillieferungnummer": number,
  "autofreigabe": 0 | 1,
  "freigabe": 0 | 1,
  "nachbesserung": 0 | 1,
  "abgeschlossen": 0 | 1,
  "nachlieferung": 0 | 1,
  "versandart": string,
  "lieferbedingung": string;
  "autoversand": 1,
  "keinporto": 0 | 1,
  "art": "standardauftrag",
  "fastlane": 0 | 1,
  "lieferungtrotzsperre": 0 | 1,
  "keinestornomail": 0 | 1,
  "keinetrackingmail": 0 | 1,
  "zahlungsmailcounter": number,
  "zahlungsweise": "rechnung",
  "zahlungszieltage": number,
  "zahlungszieltageskonto": number,
  "zahlungszielskonto": "2.00",
  "skontobetrag": "0.0000",
  "skontoberechnet": 0 | 1,
  "abweichendelieferadresse": 0 | 1,
  "liefername": string;
  "liefertitel": string;
  "lieferansprechpartner": string;
  "lieferabteilung": string;
  "lieferunterabteilung": string;
  "lieferadresszusatz": string;
  "lieferstrasse": string;
  "lieferort": string;
  "lieferplz": string;
  "lieferland": string;
  "lieferbundesstaat": string;
  "lieferemail": string;
  "lieferid": number,
  "liefergln": string;
  "versendet": 0 | 1,
  /**
   * date string "yyyyy-MM-dd"
   * @example "2022-08-17"
   */
  "versendet_am": string;
  "versendet_per": string;
  "versendet_durch": string;
  "angebotid": 0,
  "gln": string;
  "bearbeiterid": 1,
  "bearbeiter": "Administrator",
  "ohne_artikeltext": 0,
  "ustid": string;
  "ust_befreit": 0,
  "ust_inner": 0,
  "anzeigesteuer": 0,
  "waehrung": "EUR",
  "sprache": "deutsch",
  "kurs": "0.00000000",
  "kostenstelle": string;
  "freitext": string;
  "internebemerkung": string;
  "bodyzusatz": string;
  "shop": 0,
  "shopextid": string;
  "shopextstatus": string;
}