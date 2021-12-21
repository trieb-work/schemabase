"use strict";
(() => {
var exports = {};
exports.id = 867;
exports.ids = [867];
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

/***/ 95549:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46304);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9926);
/* harmony import */ var _eci_ids__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26240);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(74824);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(65400);
/* harmony import */ var _eci_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(69523);
/* harmony import */ var _eci_saleor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(50077);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([zod__WEBPACK_IMPORTED_MODULE_1__]);
zod__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];







const requestValidation = zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        tenantId: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
    }),
    headers: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        "x-saleor-domain": zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
    }),
    body: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        auth_token: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
    })
});
/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */ const webhook = async ({ backgroundContext , req , res ,  })=>{
    var ref;
    const { query: { tenantId  } , headers , body: { auth_token: token  } ,  } = req;
    const ctx = await (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
    /**
   * Saleor in a container will not have a real domain, so we override it here :/
   * see https://github.com/trieb-work/eci/issues/88
   */ const domain = headers["x-saleor-domain"].replace("localhost", "saleor.eci");
    ctx.logger = ctx.logger.with({
        tenantId,
        saleor: domain
    });
    ctx.logger.info("Registering app");
    const saleorClient = (0,_eci_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .newSaleorClient */ .Vy)(ctx, domain, token);
    const idResponse = await saleorClient.app();
    ctx.logger.info("app", {
        idResponse
    });
    if (!((ref = idResponse.app) === null || ref === void 0 ? void 0 : ref.id)) {
        throw new _eci_errors__WEBPACK_IMPORTED_MODULE_5__/* .HttpError */ .oo(500, "No app found");
    }
    const app = await ctx.prisma.installedSaleorApp.create({
        data: {
            id: idResponse.app.id,
            token,
            webhooks: {
                create: {
                    id: _eci_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
                    name: "Catch all",
                    secret: {
                        create: {
                            id: _eci_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
                            secret: _eci_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("secretKey")
                        }
                    }
                }
            },
            saleorApp: {
                create: {
                    id: _eci_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
                    name: "eCommerce Integration",
                    // channelSlug: "",
                    tenantId,
                    domain
                }
            }
        },
        include: {
            saleorApp: true,
            webhooks: {
                include: {
                    secret: true
                }
            }
        }
    });
    ctx.logger.info("Added app to db", {
        app
    });
    const saleorWebhook = await saleorClient.webhookCreate({
        input: {
            targetUrl: `${_chronark_env__WEBPACK_IMPORTED_MODULE_3__/* .env.require */ .O.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${app.webhooks[0].id}`,
            events: [
                _eci_saleor__WEBPACK_IMPORTED_MODULE_6__/* .WebhookEventTypeEnum.AnyEvents */ .zq.AnyEvents
            ],
            secretKey: app.webhooks[0].secret.secret,
            isActive: true,
            name: app.webhooks[0].name,
            app: app.id
        }
    });
    ctx.logger.info("Added webhook to saleor", {
        saleorWebhook
    });
    res.json({
        status: "received",
        traceId: ctx.trace.id
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_4__/* .handleWebhook */ .q)({
    webhook,
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
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [938,154,172,304], () => (__webpack_exec__(95549)));
module.exports = __webpack_exports__;

})();