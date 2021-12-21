"use strict";
(() => {
var exports = {};
exports.id = 967;
exports.ids = [967];
exports.modules = {

/***/ 53524:
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ 59514:
/***/ ((module) => {

module.exports = require("mime-types");

/***/ }),

/***/ 9926:
/***/ ((module) => {

module.exports = import("zod");;

/***/ }),

/***/ 39491:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 50852:
/***/ ((module) => {

module.exports = require("async_hooks");

/***/ }),

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 32081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 67643:
/***/ ((module) => {

module.exports = require("diagnostics_channel");

/***/ }),

/***/ 9523:
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ 13639:
/***/ ((module) => {

module.exports = require("domain");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 57147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 73292:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 98188:
/***/ ((module) => {

module.exports = require("module");

/***/ }),

/***/ 41808:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 4074:
/***/ ((module) => {

module.exports = require("perf_hooks");

/***/ }),

/***/ 77282:
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ 63477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 35356:
/***/ ((module) => {

module.exports = require("stream/web");

/***/ }),

/***/ 71576:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 39512:
/***/ ((module) => {

module.exports = require("timers");

/***/ }),

/***/ 24404:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 76224:
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 26144:
/***/ ((module) => {

module.exports = require("vm");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 88870:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46304);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9926);
/* harmony import */ var _eci_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(69523);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(65400);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(74824);
/* harmony import */ var _eci_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(21479);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([zod__WEBPACK_IMPORTED_MODULE_1__]);
zod__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];







const requestValidation = zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        webhookId: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
    }),
    headers: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        authorization: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().nonempty()
    }),
    body: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        event: zod__WEBPACK_IMPORTED_MODULE_1__.z["enum"]([
            "entry.create",
            "entry.update",
            "entry.delete"
        ]),
        created_at: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),
        model: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),
        entry: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
            id: zod__WEBPACK_IMPORTED_MODULE_1__.z.number().int(),
            created_at: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),
            updated_at: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
        })
    })
});
/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */ const webhook1 = async ({ backgroundContext , req , res ,  })=>{
    const { headers: { authorization  } , query: { webhookId  } , body ,  } = req;
    const ctx = await (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
    ctx.logger.info("Incoming webhook from strapi");
    const webhook = await ctx.prisma.incomingStrapiWebhook.findUnique({
        where: {
            id: webhookId
        },
        include: {
            secret: true,
            strapiApp: {
                include: {
                    integration: {
                        include: {
                            zohoApp: true,
                            subscription: true
                        }
                    }
                }
            }
        }
    });
    if (!webhook) {
        throw new _eci_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(404, `Webhook not found: ${webhookId}`);
    }
    if ((0,crypto__WEBPACK_IMPORTED_MODULE_4__.createHash)("sha256").update(authorization).digest("hex") !== webhook.secret.secret) {
        throw new _eci_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(403, "Authorization token invalid");
    }
    const { strapiApp  } = webhook;
    if (!strapiApp) {
        throw new _eci_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(400, "strapi app is not configured");
    }
    const { integration  } = strapiApp;
    if (!integration) {
        throw new _eci_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(400, "Integration is not configured");
    }
    /**
   * Ensure the integration is enabled and payed for
   */ (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .authorizeIntegration */ .Zz)(integration);
    if (req.body.model !== integration.strapiContentType) {
        ctx.logger.info("Content type does not match, I'll do nothing", {
            received: req.body.model,
            expected: integration.strapiContentType
        });
        return res.json({
            status: "received",
            traceId: ctx.trace.id
        });
    }
    const kafka = await _eci_events__WEBPACK_IMPORTED_MODULE_6__/* .KafkaProducer["new"] */ .NB["new"]({
        signer: new _eci_events__WEBPACK_IMPORTED_MODULE_6__/* .Signer */ .Ep({
            signingKey: _chronark_env__WEBPACK_IMPORTED_MODULE_5__/* .env.require */ .O.require("SIGNING_KEY")
        })
    });
    const message = new _eci_events__WEBPACK_IMPORTED_MODULE_6__/* .Message */ .v0({
        headers: {
            traceId: ctx.trace.id
        },
        content: {
            ...req.body,
            zohoAppId: integration.zohoApp.id
        }
    });
    const { messageId , partition , offset  } = await kafka.produce(`strapi.${body.event}`, message);
    ctx.logger.info("Queued new event", {
        messageId
    });
    await kafka.close();
    res.json({
        status: "received",
        traceId: ctx.trace.id,
        messageId,
        partition,
        offset
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_3__/* .handleWebhook */ .q)({
    webhook: webhook1,
    validation: {
        http: {
            allowedMethods: [
                "POST"
            ]
        },
        request: requestValidation
    }
}));

});

/***/ }),

/***/ 21479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NB": () => (/* reexport */ KafkaProducer),
  "v0": () => (/* reexport */ message_Message),
  "Ep": () => (/* reexport */ Signer)
});

// UNUSED EXPORTS: KafkaSubscriber, SignatureError

// EXTERNAL MODULE: ../../pkg/errors/index.ts + 4 modules
var errors = __webpack_require__(69523);
;// CONCATENATED MODULE: ../../pkg/events/src/errors.ts

class SignatureError extends errors/* GenericError */.pY {
    constructor(got, expected){
        super("SignatureError", `Signature is invalid, got: ${got}, expected: ${expected}`);
    }
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/@chronark+env@0.1.2/node_modules/@chronark/env/esm/mod.js + 2 modules
var mod = __webpack_require__(74824);
// EXTERNAL MODULE: ../../node_modules/.pnpm/kafkajs@1.15.0/node_modules/kafkajs/index.js
var kafkajs = __webpack_require__(96548);
// EXTERNAL MODULE: ../../pkg/ids/index.ts + 1 modules
var ids = __webpack_require__(26240);
;// CONCATENATED MODULE: ../../pkg/events/src/message.ts

class message_Message {
    constructor(message){
        this.headers = Object.freeze({
            id: message.headers.id ?? ids.id.id("message"),
            ...message.headers
        });
        this.content = Object.freeze(message.content);
    }
    serialize() {
        return Buffer.from(JSON.stringify({
            headers: this.headers,
            content: this.content
        }));
    }
    static deserialize(buf) {
        const message = JSON.parse(buf.toString());
        return new message_Message(message);
    }
}

;// CONCATENATED MODULE: ../../pkg/events/src/events.ts



const newKafkaClient = ()=>{
    return new kafkajs.Kafka({
        brokers: [
            mod/* env.require */.O.require("KAFKA_BROKER_URL")
        ]
    });
};
class KafkaProducer {
    constructor(config){
        this.producer = config.producer;
        this.signer = config.signer;
    }
    static async new(config1) {
        const k = newKafkaClient();
        const producer = k.producer();
        await producer.connect();
        return new KafkaProducer({
            producer,
            signer: config1.signer
        });
    }
    async produce(topic, message1, opts) {
        const serialized = message1.serialize();
        const signature = this.signer.sign(serialized);
        const messages = [
            {
                key: opts === null || opts === void 0 ? void 0 : opts.key,
                headers: {
                    ...opts === null || opts === void 0 ? void 0 : opts.headers,
                    signature
                },
                value: serialized
            }, 
        ];
        const res = await this.producer.send({
            topic,
            messages
        });
        return {
            messageId: message1.headers.id,
            partition: res[0].partition,
            offset: res[0].offset
        };
    }
    async close() {
        this.producer.disconnect();
    }
}
class KafkaSubscriber {
    constructor(config2){
        this.consumer = config2.consumer;
        this.signer = config2.signer;
        this.logger = config2.logger;
        this.errorProducer = config2.errorProducer;
    }
    static async new(config3) {
        const k = newKafkaClient();
        const consumer = k.consumer({
            groupId: config3.groupId
        });
        await consumer.connect();
        for (const topic of config3.topics){
            await consumer.subscribe({
                topic
            });
        }
        const errorProducer = k.producer();
        await errorProducer.connect();
        return new KafkaSubscriber({
            consumer,
            errorProducer,
            signer: config3.signer,
            logger: config3.logger
        });
    }
    async close() {
        await Promise.all([
            this.consumer.disconnect(),
            this.errorProducer.disconnect(), 
        ]);
    }
    async subscribe(process) {
        this.consumer.run({
            eachMessage: async (payload)=>{
                try {
                    if (!payload.message.value) {
                        throw new Error(`Kafka did not return a message value`);
                    }
                    const message = Message.deserialize(payload.message.value);
                    const { headers  } = payload.message;
                    if (!headers || !headers["signature"]) {
                        throw new Error(`Kafka message does not have signature header`);
                    }
                    const signature = typeof headers["signature"] === "string" ? headers["signature"] : headers["signature"].toString();
                    this.signer.verify(message.serialize(), signature);
                    this.logger.info("Incoming message", {
                        time: payload.message.timestamp
                    });
                    if (!payload.message.value) {
                        throw new Error(`Kafka did not return a message value`);
                    }
                    await process(message);
                } catch (error) {
                    const err = error;
                    this.logger.error("Unable to process message", {
                        err: err.message
                    });
                    payload.message.headers ??= {
                    };
                    payload.message.headers["error"] = err.message;
                    await this.errorProducer.send({
                        topic: "UNHANDLED_EXCEPTION",
                        messages: [
                            payload.message
                        ]
                    });
                }
            }
        });
    }
}

// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6113);
;// CONCATENATED MODULE: ../../pkg/events/src/signature.ts


/**
 * Sign and verify json objects
 */ class Signer {
    constructor({ signingKey  }){
        this.signingKey = signingKey;
    }
    /**
   * Create a signature for the given data.
   * @param data - object to be signed
   * @returns
   */ sign(data) {
        return (0,external_crypto_.createHmac)("sha256", this.signingKey).update(JSON.stringify(data)).digest("hex");
    }
    /**
   * Verify the data was signed by the given signature.
   */ verify(data1, expectedSignature) {
        const signature = this.sign(data1);
        if (signature !== expectedSignature) {
            throw new SignatureError(signature, expectedSignature);
        }
    }
}

;// CONCATENATED MODULE: ../../pkg/events/index.ts






/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [938,154,548,172,304], () => (__webpack_exec__(88870)));
module.exports = __webpack_exports__;

})();