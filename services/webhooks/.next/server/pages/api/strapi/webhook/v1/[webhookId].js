"use strict";
(() => {
var exports = {};
exports.id = 967;
exports.ids = [967];
exports.modules = {

/***/ 1415:
/***/ ((module) => {

module.exports = require("@chronark/prefixed-id");

/***/ }),

/***/ 9579:
/***/ ((module) => {

module.exports = require("@elastic/ecs-winston-format");

/***/ }),

/***/ 3524:
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 5805:
/***/ ((module) => {

module.exports = require("graphql-request");

/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = require("graphql-tag");

/***/ }),

/***/ 4543:
/***/ ((module) => {

module.exports = require("kafkajs");

/***/ }),

/***/ 7773:
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ 2072:
/***/ ((module) => {

module.exports = require("winston-elasticsearch");

/***/ }),

/***/ 2684:
/***/ ((module) => {

module.exports = import("@chronark/env");;

/***/ }),

/***/ 9926:
/***/ ((module) => {

module.exports = import("zod");;

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 7285:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NB": () => (/* reexport safe */ _src_events__WEBPACK_IMPORTED_MODULE_1__.N),
/* harmony export */   "v0": () => (/* reexport safe */ _src_message__WEBPACK_IMPORTED_MODULE_2__.v),
/* harmony export */   "Ep": () => (/* reexport safe */ _src_signature__WEBPACK_IMPORTED_MODULE_3__.E)
/* harmony export */ });
/* harmony import */ var _src_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3927);
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1459);
/* harmony import */ var _src_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4243);
/* harmony import */ var _src_signature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6317);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_src_events__WEBPACK_IMPORTED_MODULE_1__]);
_src_events__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];





});

/***/ }),

/***/ 3927:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ SignatureError)
/* harmony export */ });
/* harmony import */ var _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

class SignatureError extends _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_0__/* .GenericError */ .pY {
    constructor(got, expected){
        super("SignatureError", `Signature is invalid, got: ${got}, expected: ${expected}`);
    }
}


/***/ }),

/***/ 1459:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ KafkaProducer)
/* harmony export */ });
/* unused harmony export KafkaSubscriber */
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2684);
/* harmony import */ var kafkajs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4543);
/* harmony import */ var kafkajs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kafkajs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4243);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chronark_env__WEBPACK_IMPORTED_MODULE_0__]);
_chronark_env__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];



const newKafkaClient = ()=>{
    return new kafkajs__WEBPACK_IMPORTED_MODULE_1__.Kafka({
        brokers: [
            _chronark_env__WEBPACK_IMPORTED_MODULE_0__.env.require("KAFKA_BROKER_URL")
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

});

/***/ }),

/***/ 4243:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v": () => (/* binding */ Message)
/* harmony export */ });
/* harmony import */ var _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4497);

class Message {
    constructor(message){
        this.headers = Object.freeze({
            id: message.headers.id ?? _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_0__.id.id("message"),
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
        return new Message(message);
    }
}


/***/ }),

/***/ 6317:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": () => (/* binding */ Signer)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3927);


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
        return (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createHmac)("sha256", this.signingKey).update(JSON.stringify(data)).digest("hex");
    }
    /**
   * Verify the data was signed by the given signature.
   */ verify(data1, expectedSignature) {
        const signature = this.sign(data1);
        if (signature !== expectedSignature) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .SignatureError */ ._(signature, expectedSignature);
        }
    }
}


/***/ }),

/***/ 8870:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5247);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9926);
/* harmony import */ var _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8914);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2684);
/* harmony import */ var _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7285);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__, _chronark_env__WEBPACK_IMPORTED_MODULE_5__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__, _chronark_env__WEBPACK_IMPORTED_MODULE_5__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);







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
    const ctx = await (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
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
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(404, `Webhook not found: ${webhookId}`);
    }
    if ((0,crypto__WEBPACK_IMPORTED_MODULE_4__.createHash)("sha256").update(authorization).digest("hex") !== webhook.secret.secret) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(403, "Authorization token invalid");
    }
    const { strapiApp  } = webhook;
    if (!strapiApp) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(400, "strapi app is not configured");
    }
    const { integration  } = strapiApp;
    if (!integration) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_2__/* .HttpError */ .oo(400, "Integration is not configured");
    }
    /**
   * Ensure the integration is enabled and payed for
   */ (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .authorizeIntegration */ .Zz)(integration);
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
    const kafka = await _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__/* .KafkaProducer["new"] */ .NB["new"]({
        signer: new _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__/* .Signer */ .Ep({
            signingKey: _chronark_env__WEBPACK_IMPORTED_MODULE_5__.env.require("SIGNING_KEY")
        })
    });
    const message = new _eci_pkg_events__WEBPACK_IMPORTED_MODULE_6__/* .Message */ .v0({
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__/* .handleWebhook */ .q)({
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

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [914,247], () => (__webpack_exec__(8870)));
module.exports = __webpack_exports__;

})();