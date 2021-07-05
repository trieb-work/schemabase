import apm from "elastic-apm-node/start"
import { IncomingHttpHeaders } from "http"

import winston from "winston"
import { ElasticsearchTransport, ElasticsearchTransportOptions } from "winston-elasticsearch"
let globalEsTransport: ElasticsearchTransport
let globalWinston: winston.Logger

const env = process.env["APM_ENV"] || "dev"

/**
 * Flush logs and APM data to elasticsearch before ending the session
 */
export const apmFlush = async () => {
  const res1 = globalEsTransport ? globalEsTransport.flush() : true
  const res2 = new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== "production") return resolve(true)
    apm.flush((err: unknown) => (err ? reject(err) : resolve(err)))
  })
  await Promise.all([res1, res2])
  return true
}

interface CommonConfigData {
  elasticLoggingServer: string
}

const apmSetup = () => (apm?.isStarted() ? apm : apm.start())

// const apmSetup = (apmConfig :ApmConfig) => (apm?.isStarted() ? apm : apm.start({
//     serviceName: apmConfig.serviceName || 'eCommerce-Integrations',
//     environment: env,
//     serverUrl: apmConfig.elasticApmServer,
//     secretToken: apmConfig.elasticApmSecretToken,
//     usePathAsTransactionName: true,
//     captureBody: 'transactions',
//     // active: process.env.NODE_ENV === 'production',
//     metricsInterval: '0s',
//     transactionSampleRate: 0,
// }));

const loggingAndApmSetup = (commonConfig: CommonConfigData) => {
  const returnApm = apmSetup()
  const esTransportOpts: ElasticsearchTransportOptions = {
    apm: returnApm,
    dataStream: true,
    clientOpts: {
      node: commonConfig.elasticLoggingServer,
      auth: {
        username: "logger",
        password: "logger",
      },
    },
  }
  const esTransport = globalEsTransport || new ElasticsearchTransport(esTransportOpts)
  globalEsTransport = esTransport

  const winstonLogger =
    globalWinston ||
    winston.createLogger({
      level: "info",
      transports: [esTransport, new winston.transports.Console()],
    })
  globalWinston = winstonLogger

  return winstonLogger
}

type MetaObject = {
  "saleor-domain"?: string
  "saleor-event"?: string
  "zoho-org-id"?: string
  "easypost-event-id"?: string
  "easypost-user-id"?: string
  appConfigId?: number
  environment?: string
  cuid?: string
  "zoho-invoice-id"?: string
  "easypost-tracking-status"?: string
  "easypost-tracking-code"?: string
}

/**
 * Custom Typeguard to check if this request is a nextAPIRequest or not
 * @param arg
 */
function isNextRequest(arg: any): arg is IncomingData {
  return arg?.httpVersion !== undefined
}

interface IncomingData {
  headers?: IncomingHttpHeaders
  body?: {
    id: string
    result?: {
      tracking_code: string
      status: string
    }
    invoice?: {
      invoice_id: string
    }
  }
  query?: {
    [key: string]: string | string[]
  }
}
/**
 * Creates and Returns the Standard Winston logger with metadata
 * @param req The next.js Req Object
 */
export const logAndMeasure = (req: IncomingData | MetaObject, commonConfig: CommonConfigData) => {
  const winstonLogger = loggingAndApmSetup(commonConfig)
  const defaultMeta: MetaObject = {}

  if (isNextRequest(req)) {
    const { cuid } = req?.query as { cuid: string }
    const easyPostTrackingCode = req?.body?.result?.tracking_code as string
    const easypostUserId = req?.headers?.["X-Webhook-User-Id"] as string
    const easypostTrackingStatus = req?.body?.result?.status as string

    const invoiceId = req?.body?.invoice?.invoice_id as string

    if (cuid) {
      defaultMeta.cuid = cuid
      apm.setLabel("cuid", cuid)
    }
    if (req?.headers?.["x-saleor-domain"]) {
      defaultMeta["saleor-domain"] = req?.headers?.["x-saleor-domain"] as string
      apm.setLabel("saleor-domain", req?.headers?.["x-saleor-domain"] as string)
    }
    if (req?.headers?.["x-saleor-event"]) {
      defaultMeta["saleor-event"] = req?.headers?.["x-saleor-event"] as string
      apm.setLabel("saleor-event", req?.headers?.["x-saleor-event"] as string)
    }
    if (easypostUserId && req?.body?.id) defaultMeta["easypost-event-id"] = req?.body?.id as string
    if (easypostUserId) defaultMeta["easypost-user-id"] = easypostUserId
    if (easyPostTrackingCode) defaultMeta["easypost-tracking-code"] = easyPostTrackingCode
    if (easypostTrackingStatus) defaultMeta["easypost-tracking-status"] = easypostTrackingStatus

    // eslint-disable-next-line max-len
    const zohoOrgId =
      (req?.headers?.["x-com-zoho-organizationid"] as string) ||
      (req?.query?.["zoho-org-id"] as string) ||
      (req?.headers?.["dre-scope-id"] as string)
    if (zohoOrgId) {
      defaultMeta["zoho-org-id"] = zohoOrgId
      apm.setLabel("zoho-org-id", zohoOrgId)
    }

    if (invoiceId) {
      defaultMeta["zoho-invoice-id"] = invoiceId
    }
  } else {
    // this request is coming from the worker for example.
    defaultMeta.appConfigId = req?.appConfigId
    defaultMeta["saleor-domain"] = req?.["saleor-domain"]
  }

  defaultMeta.environment = env

  // we always start a child logger with corresponding metadata used just for this request
  const childLogger = winstonLogger.child(defaultMeta)

  return childLogger
}

/**
 * Just start the APM setup. Logging can be started later-on
 */
export const justMeasure = () => {
  apmSetup()
  return true
}

export type WinstonLoggerType = winston.Logger
