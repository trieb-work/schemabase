/* tslint:disable */
/* eslint-disable */
/**
 * DHL Shipment Tracking API
 * ### DHL Shipment Tracking API The unified DHL tracking experience. Detailed documentation and release notes are available at https://developer.dhl/api-reference/shipment-tracking.
 *
 * The version of the OpenAPI document: 1.4.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from "./configuration";
import globalAxios, {
    AxiosPromise,
    AxiosInstance,
    AxiosRequestConfig,
} from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
    DUMMY_BASE_URL,
    assertParamExists,
    setApiKeyToObject,
    setSearchParams,
    toPathString,
    createRequestFunction,
} from "./common";
// @ts-ignore
import { BASE_PATH, RequestArgs, BaseAPI } from "./base";

/**
 *
 * @export
 * @interface ShipmentsGet404Response
 */
export interface ShipmentsGet404Response {
    /**
     *
     * @type {string}
     * @memberof ShipmentsGet404Response
     */
    type?: string;
    /**
     *
     * @type {string}
     * @memberof ShipmentsGet404Response
     */
    title?: string;
    /**
     *
     * @type {number}
     * @memberof ShipmentsGet404Response
     */
    status?: number;
    /**
     *
     * @type {string}
     * @memberof ShipmentsGet404Response
     */
    detail?: string;
    /**
     *
     * @type {string}
     * @memberof ShipmentsGet404Response
     */
    instance?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsApiProblemDetail
 */
export interface SupermodelIoLogisticsApiProblemDetail {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsApiProblemDetail
     */
    type?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsApiProblemDetail
     */
    title?: string;
    /**
     *
     * @type {number}
     * @memberof SupermodelIoLogisticsApiProblemDetail
     */
    status?: number;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsApiProblemDetail
     */
    detail?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsApiProblemDetail
     */
    instance?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingOrganization
 */
export interface SupermodelIoLogisticsSupportingOrganization {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingOrganization
     */
    organizationName?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingPerson
 */
export interface SupermodelIoLogisticsSupportingPerson {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPerson
     */
    familyName?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPerson
     */
    givenName?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPerson
     */
    name?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingPlace
 */
export interface SupermodelIoLogisticsSupportingPlace {
    /**
     *
     * @type {SupermodelIoLogisticsSupportingPlaceAddress}
     * @memberof SupermodelIoLogisticsSupportingPlace
     */
    address?: SupermodelIoLogisticsSupportingPlaceAddress;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingPlaceAddress
 */
export interface SupermodelIoLogisticsSupportingPlaceAddress {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPlaceAddress
     */
    countryCode?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPlaceAddress
     */
    postalCode?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPlaceAddress
     */
    addressLocality?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingPlaceAddress
     */
    streetAddress?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingProduct
 */
export interface SupermodelIoLogisticsSupportingProduct {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingProduct
     */
    productName?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingProvider
 */
export interface SupermodelIoLogisticsSupportingProvider {
    /**
     * The name of the provider organization handling the delivery in the destination country.
     * @type {string}
     * @memberof SupermodelIoLogisticsSupportingProvider
     */
    destinationProvider?: SupermodelIoLogisticsSupportingProviderDestinationProviderEnum;
}

export const SupermodelIoLogisticsSupportingProviderDestinationProviderEnum = {
    Oepag: "oepag",
    Express: "express",
    ParcelBl: "parcel-bl",
    Bpost: "bpost",
    Rapido: "rapido",
    AcsCourier: "acs-courier",
    ParcelCz: "parcel-cz",
    Freight: "freight",
    ParcelDe: "parcel-de",
    TransOFlex: "trans-o-flex",
    Bring: "bring",
    ParcelEs: "parcel-es",
    Posti: "posti",
    RelaisColis: "relais-colis",
    ColisPrive: "colis-prive",
    FreightFr: "freight-fr",
    Chronopost: "chronopost",
    ParcelUk: "parcel-uk",
    HrvatskaPosta: "hrvatska-posta",
    MagyarPosta: "magyar-posta",
    Anpost: "anpost",
    Fastway: "fastway",
    ParcelLu: "parcel-lu",
    ParcelBe: "parcel-be",
    ParcelNl: "parcel-nl",
    Posta: "posta",
    SlovakParcelService: "slovak-parcel-service",
    ParcelPl: "parcel-pl",
    ParcelPt: "parcel-pt",
    UrgentCargus: "urgent-cargus",
} as const;

export type SupermodelIoLogisticsSupportingProviderDestinationProviderEnum =
    (typeof SupermodelIoLogisticsSupportingProviderDestinationProviderEnum)[keyof typeof SupermodelIoLogisticsSupportingProviderDestinationProviderEnum];

/**
 *
 * @export
 * @interface SupermodelIoLogisticsSupportingTimestamp
 */
export interface SupermodelIoLogisticsSupportingTimestamp {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingDgfAirport
 */
export interface SupermodelIoLogisticsTrackingDgfAirport {
    /**
     *
     * @type {SupermodelIoSchemaorgPropertiesIataCode}
     * @memberof SupermodelIoLogisticsTrackingDgfAirport
     */
    "dgf:locationCode"?: SupermodelIoSchemaorgPropertiesIataCode;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingDgfAirport
     */
    countryCode?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingDgfAirport
     */
    "dgf:locationName"?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingDgfLocation
 */
export interface SupermodelIoLogisticsTrackingDgfLocation {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingDgfLocation
     */
    "dgf:locationName"?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingDgfRoute
 */
export interface SupermodelIoLogisticsTrackingDgfRoute {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:vesselName"?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:voyageFlightNumber"?: string;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfAirport}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:airportOfDeparture"?: SupermodelIoLogisticsTrackingDgfAirport;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfAirport}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:airportOfDestination"?: SupermodelIoLogisticsTrackingDgfAirport;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedDepartureDate}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:estimatedDepartureDate"?: SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedDepartureDate;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedArrivalDate}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:estimatedArrivalDate"?: SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedArrivalDate;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfLocation}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:placeOfAcceptance"?: SupermodelIoLogisticsTrackingDgfLocation;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfLocation}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:portOfLoading"?: SupermodelIoLogisticsTrackingDgfLocation;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfLocation}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:portOfUnloading"?: SupermodelIoLogisticsTrackingDgfLocation;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingDgfLocation}
     * @memberof SupermodelIoLogisticsTrackingDgfRoute
     */
    "dgf:placeOfDelivery"?: SupermodelIoLogisticsTrackingDgfLocation;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedArrivalDate
 */
export interface SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedArrivalDate {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedDepartureDate
 */
export interface SupermodelIoLogisticsTrackingDgfRouteDgfEstimatedDepartureDate {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingProofOfDelivery
 */
export interface SupermodelIoLogisticsTrackingProofOfDelivery {
    /**
     *
     * @type {SupermodelIoLogisticsTrackingProofOfDeliveryTimestamp}
     * @memberof SupermodelIoLogisticsTrackingProofOfDelivery
     */
    timestamp?: SupermodelIoLogisticsTrackingProofOfDeliveryTimestamp;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingProofOfDelivery
     */
    signatureUrl?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingProofOfDelivery
     */
    documentUrl?: string;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingPerson}
     * @memberof SupermodelIoLogisticsTrackingProofOfDelivery
     */
    signed?: SupermodelIoLogisticsSupportingPerson;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingProofOfDeliveryTimestamp
 */
export interface SupermodelIoLogisticsTrackingProofOfDeliveryTimestamp {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipment
 */
export interface SupermodelIoLogisticsTrackingShipment {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    id?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    service?: SupermodelIoLogisticsTrackingShipmentServiceEnum;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingPlace}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    origin?: SupermodelIoLogisticsSupportingPlace;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingPlace}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    destination?: SupermodelIoLogisticsSupportingPlace;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEvent}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    status?: SupermodelIoLogisticsTrackingShipmentEvent;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    estimatedTimeOfDelivery?: SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    estimatedDeliveryTimeFrame?: SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame;
    /**
     *
     * @type {any}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    estimatedTimeOfDeliveryRemark?: any;
    /**
     *
     * @type {any}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    serviceUrl?: any;
    /**
     *
     * @type {any}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    rerouteUrl?: any;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentDetails}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    details?: SupermodelIoLogisticsTrackingShipmentDetails;
    /**
     *
     * @type {Array<SupermodelIoLogisticsTrackingShipmentEvent>}
     * @memberof SupermodelIoLogisticsTrackingShipment
     */
    events?: Array<SupermodelIoLogisticsTrackingShipmentEvent>;
}

export const SupermodelIoLogisticsTrackingShipmentServiceEnum = {
    Freight: "freight",
    Express: "express",
    PostDe: "post-de",
    ParcelDe: "parcel-de",
    ParcelNl: "parcel-nl",
    ParcelPl: "parcel-pl",
    Dsc: "dsc",
    Dgf: "dgf",
    Ecommerce: "ecommerce",
    EcommerceEurope: "ecommerce-europe",
} as const;

export type SupermodelIoLogisticsTrackingShipmentServiceEnum =
    (typeof SupermodelIoLogisticsTrackingShipmentServiceEnum)[keyof typeof SupermodelIoLogisticsTrackingShipmentServiceEnum];

/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentDetails
 */
export interface SupermodelIoLogisticsTrackingShipmentDetails {
    /**
     *
     * @type {SupermodelIoLogisticsSupportingOrganization}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    carrier?: SupermodelIoLogisticsSupportingOrganization;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingProduct}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    product?: SupermodelIoLogisticsSupportingProduct;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingProvider}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    provider?: SupermodelIoLogisticsSupportingProvider;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentDetailsReceiver}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    receiver?: SupermodelIoLogisticsTrackingShipmentDetailsReceiver;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentDetailsReceiver}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    sender?: SupermodelIoLogisticsTrackingShipmentDetailsReceiver;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingProofOfDelivery}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    proofOfDelivery?: SupermodelIoLogisticsTrackingProofOfDelivery;
    /**
     *
     * @type {number}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    totalNumberOfPieces?: number;
    /**
     *
     * @type {Array<string>}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    pieceIds?: Array<string>;
    /**
     *
     * @type {object}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    weight?: object;
    /**
     *
     * @type {object}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    volume?: object;
    /**
     *
     * @type {number}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    loadingMeters?: number;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentDetailsDimensions}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    dimensions?: SupermodelIoLogisticsTrackingShipmentDetailsDimensions;
    /**
     *
     * @type {Array<SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner>}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    references?: Array<SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner>;
    /**
     *
     * @type {Array<SupermodelIoLogisticsTrackingDgfRoute>}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetails
     */
    "dgf:routes"?: Array<SupermodelIoLogisticsTrackingDgfRoute>;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentDetailsDimensions
 */
export interface SupermodelIoLogisticsTrackingShipmentDetailsDimensions {
    /**
     *
     * @type {object}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsDimensions
     */
    width?: object;
    /**
     *
     * @type {object}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsDimensions
     */
    height?: object;
    /**
     *
     * @type {object}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsDimensions
     */
    length?: object;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentDetailsReceiver
 */
export interface SupermodelIoLogisticsTrackingShipmentDetailsReceiver {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReceiver
     */
    organizationName?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReceiver
     */
    familyName?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReceiver
     */
    givenName?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReceiver
     */
    name?: string;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner
 */
export interface SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner
     */
    number?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentDetailsReferencesInner
     */
    type?: SupermodelIoLogisticsTrackingShipmentDetailsReferencesInnerTypeEnum;
}

export const SupermodelIoLogisticsTrackingShipmentDetailsReferencesInnerTypeEnum =
    {
        CustomerReference: "customer-reference",
        CustomerConfirmationNumber: "customer-confirmation-number",
        LocalTrackingNumber: "local-tracking-number",
        EcommerceNumber: "ecommerce-number",
        Housebill: "housebill",
        Masterbill: "masterbill",
        ContainerNumber: "container-number",
        ShipmentId: "shipment-id",
        DomesticConsignmentId: "domestic-consignment-id",
        Reference: "reference",
    } as const;

export type SupermodelIoLogisticsTrackingShipmentDetailsReferencesInnerTypeEnum =
    (typeof SupermodelIoLogisticsTrackingShipmentDetailsReferencesInnerTypeEnum)[keyof typeof SupermodelIoLogisticsTrackingShipmentDetailsReferencesInnerTypeEnum];

/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame
 */
export interface SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame {
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery}
     * @memberof SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame
     */
    estimatedFrom?: SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery;
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrameEstimatedThrough}
     * @memberof SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrame
     */
    estimatedThrough?: SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrameEstimatedThrough;
}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrameEstimatedThrough
 */
export interface SupermodelIoLogisticsTrackingShipmentEstimatedDeliveryTimeFrameEstimatedThrough {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery
 */
export interface SupermodelIoLogisticsTrackingShipmentEstimatedTimeOfDelivery {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentEvent
 */
export interface SupermodelIoLogisticsTrackingShipmentEvent {
    /**
     *
     * @type {SupermodelIoLogisticsTrackingShipmentEventTimestamp}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    timestamp?: SupermodelIoLogisticsTrackingShipmentEventTimestamp;
    /**
     *
     * @type {SupermodelIoLogisticsSupportingPlace}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    location?: SupermodelIoLogisticsSupportingPlace;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    statusCode?: SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    status?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    description?: string;
    /**
     *
     * @type {Array<string>}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    pieceIds?: Array<string>;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    remark?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipmentEvent
     */
    nextSteps?: string;
}

export const SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum = {
    PreTransit: "pre-transit",
    Transit: "transit",
    Delivered: "delivered",
    Failure: "failure",
    Unknown: "unknown",
} as const;

export type SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum =
    (typeof SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum)[keyof typeof SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum];

/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipmentEventTimestamp
 */
export interface SupermodelIoLogisticsTrackingShipmentEventTimestamp {}
/**
 *
 * @export
 * @interface SupermodelIoLogisticsTrackingShipments
 */
export interface SupermodelIoLogisticsTrackingShipments {
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    url?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    prevUrl?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    nextUrl?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    firstUrl?: string;
    /**
     *
     * @type {string}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    lastUrl?: string;
    /**
     *
     * @type {Array<SupermodelIoLogisticsTrackingShipment>}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    shipments?: Array<SupermodelIoLogisticsTrackingShipment>;
    /**
     *
     * @type {Array<string>}
     * @memberof SupermodelIoLogisticsTrackingShipments
     */
    possibleAdditionalShipmentsUrl?: Array<string>;
}
/**
 *
 * @export
 * @interface SupermodelIoSchemaorgDate
 */
export interface SupermodelIoSchemaorgDate {}
/**
 *
 * @export
 * @interface SupermodelIoSchemaorgDateTime
 */
export interface SupermodelIoSchemaorgDateTime {}
/**
 *
 * @export
 * @interface SupermodelIoSchemaorgPropertiesIataCode
 */
export interface SupermodelIoSchemaorgPropertiesIataCode {}
/**
 *
 * @export
 * @interface SupermodelIoSchemaorgText
 */
export interface SupermodelIoSchemaorgText {}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (
    configuration?: Configuration,
) {
    return {
        /**
         * Retrieves the tracking information for shipments(s). The shipments are identified using the required `trackingNumber` query parameter.
         * @summary Retrieve Tracking Information
         * @param {string} trackingNumber The tracking number of the shipment for which to return the information.
         * @param {'express' | 'parcel-de' | 'ecommerce' | 'dgf' | 'parcel-uk' | 'post-de' | 'sameday' | 'freight' | 'parcel-nl' | 'parcel-pl' | 'dsc' | 'ecommerce-europe'} [service] Hint which service (provider) should be used to resolve the tracking number.
         * @param {string} [requesterCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code represents country of the consumer of the API response. It optimizes the return of the API response.
         * @param {string} [originCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code of the shipment origin to further qualify the shipment tracking number (&#x60;trackingNumber&#x60;) parameter of the request. This parameter is necessary to search for the shipment in dsc service.
         * @param {string} [recipientPostalCode] Postal code of the destination address to * further qualify the shipment tracking number (trackingNumber) parameter of the request or * parcel-nl and parcel-de services to display full set of data in the response.
         * @param {string} [language] ISO 639-1 2-character language code for the response. This parameter serves as an indication of the client preferences ONLY. Language availability depends on the service used. The actual response language is indicated by the Content-Language header.
         * @param {number} [offset] Pagination parameter. Offset from the start of the result set at which to retrieve the remainder of the results (if any).
         * @param {number} [limit] Pagination parameter. Maximal number of results to retireve.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        shipmentsGet: async (
            trackingNumber: string,
            service?:
                | "express"
                | "parcel-de"
                | "ecommerce"
                | "dgf"
                | "parcel-uk"
                | "post-de"
                | "sameday"
                | "freight"
                | "parcel-nl"
                | "parcel-pl"
                | "dsc"
                | "ecommerce-europe",
            requesterCountryCode?: string,
            originCountryCode?: string,
            recipientPostalCode?: string,
            language?: string,
            offset?: number,
            limit?: number,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            // verify required parameter 'trackingNumber' is not null or undefined
            assertParamExists("shipmentsGet", "trackingNumber", trackingNumber);
            const localVarPath = `/shipments`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = {
                method: "GET",
                ...baseOptions,
                ...options,
            };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication ApiKeyAuth required
            await setApiKeyToObject(
                localVarHeaderParameter,
                "DHL-API-Key",
                configuration,
            );

            if (trackingNumber !== undefined) {
                localVarQueryParameter["trackingNumber"] = trackingNumber;
            }

            if (service !== undefined) {
                localVarQueryParameter["service"] = service;
            }

            if (requesterCountryCode !== undefined) {
                localVarQueryParameter["requesterCountryCode"] =
                    requesterCountryCode;
            }

            if (originCountryCode !== undefined) {
                localVarQueryParameter["originCountryCode"] = originCountryCode;
            }

            if (recipientPostalCode !== undefined) {
                localVarQueryParameter["recipientPostalCode"] =
                    recipientPostalCode;
            }

            if (language !== undefined) {
                localVarQueryParameter["language"] = language;
            }

            if (offset !== undefined) {
                localVarQueryParameter["offset"] = offset;
            }

            if (limit !== undefined) {
                localVarQueryParameter["limit"] = limit;
            }

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            };

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
    const localVarAxiosParamCreator =
        DefaultApiAxiosParamCreator(configuration);
    return {
        /**
         * Retrieves the tracking information for shipments(s). The shipments are identified using the required `trackingNumber` query parameter.
         * @summary Retrieve Tracking Information
         * @param {string} trackingNumber The tracking number of the shipment for which to return the information.
         * @param {'express' | 'parcel-de' | 'ecommerce' | 'dgf' | 'parcel-uk' | 'post-de' | 'sameday' | 'freight' | 'parcel-nl' | 'parcel-pl' | 'dsc' | 'ecommerce-europe'} [service] Hint which service (provider) should be used to resolve the tracking number.
         * @param {string} [requesterCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code represents country of the consumer of the API response. It optimizes the return of the API response.
         * @param {string} [originCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code of the shipment origin to further qualify the shipment tracking number (&#x60;trackingNumber&#x60;) parameter of the request. This parameter is necessary to search for the shipment in dsc service.
         * @param {string} [recipientPostalCode] Postal code of the destination address to * further qualify the shipment tracking number (trackingNumber) parameter of the request or * parcel-nl and parcel-de services to display full set of data in the response.
         * @param {string} [language] ISO 639-1 2-character language code for the response. This parameter serves as an indication of the client preferences ONLY. Language availability depends on the service used. The actual response language is indicated by the Content-Language header.
         * @param {number} [offset] Pagination parameter. Offset from the start of the result set at which to retrieve the remainder of the results (if any).
         * @param {number} [limit] Pagination parameter. Maximal number of results to retireve.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async shipmentsGet(
            trackingNumber: string,
            service?:
                | "express"
                | "parcel-de"
                | "ecommerce"
                | "dgf"
                | "parcel-uk"
                | "post-de"
                | "sameday"
                | "freight"
                | "parcel-nl"
                | "parcel-pl"
                | "dsc"
                | "ecommerce-europe",
            requesterCountryCode?: string,
            originCountryCode?: string,
            recipientPostalCode?: string,
            language?: string,
            offset?: number,
            limit?: number,
            options?: AxiosRequestConfig,
        ): Promise<
            (
                axios?: AxiosInstance,
                basePath?: string,
            ) => AxiosPromise<SupermodelIoLogisticsTrackingShipments>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.shipmentsGet(
                    trackingNumber,
                    service,
                    requesterCountryCode,
                    originCountryCode,
                    recipientPostalCode,
                    language,
                    offset,
                    limit,
                    options,
                );
            return createRequestFunction(
                localVarAxiosArgs,
                globalAxios,
                BASE_PATH,
                configuration,
            );
        },
    };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
) {
    const localVarFp = DefaultApiFp(configuration);
    return {
        /**
         * Retrieves the tracking information for shipments(s). The shipments are identified using the required `trackingNumber` query parameter.
         * @summary Retrieve Tracking Information
         * @param {string} trackingNumber The tracking number of the shipment for which to return the information.
         * @param {'express' | 'parcel-de' | 'ecommerce' | 'dgf' | 'parcel-uk' | 'post-de' | 'sameday' | 'freight' | 'parcel-nl' | 'parcel-pl' | 'dsc' | 'ecommerce-europe'} [service] Hint which service (provider) should be used to resolve the tracking number.
         * @param {string} [requesterCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code represents country of the consumer of the API response. It optimizes the return of the API response.
         * @param {string} [originCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code of the shipment origin to further qualify the shipment tracking number (&#x60;trackingNumber&#x60;) parameter of the request. This parameter is necessary to search for the shipment in dsc service.
         * @param {string} [recipientPostalCode] Postal code of the destination address to * further qualify the shipment tracking number (trackingNumber) parameter of the request or * parcel-nl and parcel-de services to display full set of data in the response.
         * @param {string} [language] ISO 639-1 2-character language code for the response. This parameter serves as an indication of the client preferences ONLY. Language availability depends on the service used. The actual response language is indicated by the Content-Language header.
         * @param {number} [offset] Pagination parameter. Offset from the start of the result set at which to retrieve the remainder of the results (if any).
         * @param {number} [limit] Pagination parameter. Maximal number of results to retireve.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        shipmentsGet(
            trackingNumber: string,
            service?:
                | "express"
                | "parcel-de"
                | "ecommerce"
                | "dgf"
                | "parcel-uk"
                | "post-de"
                | "sameday"
                | "freight"
                | "parcel-nl"
                | "parcel-pl"
                | "dsc"
                | "ecommerce-europe",
            requesterCountryCode?: string,
            originCountryCode?: string,
            recipientPostalCode?: string,
            language?: string,
            offset?: number,
            limit?: number,
            options?: any,
        ): AxiosPromise<SupermodelIoLogisticsTrackingShipments> {
            return localVarFp
                .shipmentsGet(
                    trackingNumber,
                    service,
                    requesterCountryCode,
                    originCountryCode,
                    recipientPostalCode,
                    language,
                    offset,
                    limit,
                    options,
                )
                .then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * Retrieves the tracking information for shipments(s). The shipments are identified using the required `trackingNumber` query parameter.
     * @summary Retrieve Tracking Information
     * @param {string} trackingNumber The tracking number of the shipment for which to return the information.
     * @param {'express' | 'parcel-de' | 'ecommerce' | 'dgf' | 'parcel-uk' | 'post-de' | 'sameday' | 'freight' | 'parcel-nl' | 'parcel-pl' | 'dsc' | 'ecommerce-europe'} [service] Hint which service (provider) should be used to resolve the tracking number.
     * @param {string} [requesterCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code represents country of the consumer of the API response. It optimizes the return of the API response.
     * @param {string} [originCountryCode] Optional [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code of the shipment origin to further qualify the shipment tracking number (&#x60;trackingNumber&#x60;) parameter of the request. This parameter is necessary to search for the shipment in dsc service.
     * @param {string} [recipientPostalCode] Postal code of the destination address to * further qualify the shipment tracking number (trackingNumber) parameter of the request or * parcel-nl and parcel-de services to display full set of data in the response.
     * @param {string} [language] ISO 639-1 2-character language code for the response. This parameter serves as an indication of the client preferences ONLY. Language availability depends on the service used. The actual response language is indicated by the Content-Language header.
     * @param {number} [offset] Pagination parameter. Offset from the start of the result set at which to retrieve the remainder of the results (if any).
     * @param {number} [limit] Pagination parameter. Maximal number of results to retireve.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public shipmentsGet(
        trackingNumber: string,
        service?:
            | "express"
            | "parcel-de"
            | "ecommerce"
            | "dgf"
            | "parcel-uk"
            | "post-de"
            | "sameday"
            | "freight"
            | "parcel-nl"
            | "parcel-pl"
            | "dsc"
            | "ecommerce-europe",
        requesterCountryCode?: string,
        originCountryCode?: string,
        recipientPostalCode?: string,
        language?: string,
        offset?: number,
        limit?: number,
        options?: AxiosRequestConfig,
    ) {
        return DefaultApiFp(this.configuration)
            .shipmentsGet(
                trackingNumber,
                service,
                requesterCountryCode,
                originCountryCode,
                recipientPostalCode,
                language,
                offset,
                limit,
                options,
            )
            .then((request) => request(this.axios, this.basePath));
    }
}
