"use strict";
(() => {
var exports = {};
exports.id = 867;
exports.ids = [867];
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

/***/ 5549:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5247);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9926);
/* harmony import */ var _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4497);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2684);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8914);
/* harmony import */ var _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(0);
/* harmony import */ var _eci_pkg_saleor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1602);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_4__, _chronark_env__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_4__, _chronark_env__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);







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
    const ctx = await (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
    /**
   * Saleor in a container will not have a real domain, so we override it here :/
   * see https://github.com/trieb-work/eci/issues/88
   */ const domain = headers["x-saleor-domain"].replace("localhost", "saleor.eci");
    ctx.logger = ctx.logger.with({
        tenantId,
        saleor: domain
    });
    ctx.logger.info("Registering app");
    const saleorClient = (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .newSaleorClient */ .Vy)(ctx, domain, token);
    const idResponse = await saleorClient.app();
    ctx.logger.info("app", {
        idResponse
    });
    if (!((ref = idResponse.app) === null || ref === void 0 ? void 0 : ref.id)) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_5__/* .HttpError */ .oo(500, "No app found");
    }
    const app = await ctx.prisma.installedSaleorApp.create({
        data: {
            id: idResponse.app.id,
            token,
            webhooks: {
                create: {
                    id: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
                    name: "Catch all",
                    secret: {
                        create: {
                            id: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
                            secret: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("secretKey")
                        }
                    }
                }
            },
            saleorApp: {
                create: {
                    id: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_2__.id.id("publicKey"),
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
            targetUrl: `${_chronark_env__WEBPACK_IMPORTED_MODULE_3__.env.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${app.webhooks[0].id}`,
            events: [
                _eci_pkg_saleor__WEBPACK_IMPORTED_MODULE_6__/* .WebhookEventTypeEnum.AnyEvents */ .zq.AnyEvents
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_4__/* .handleWebhook */ .q)({
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
var __webpack_exports__ = __webpack_require__.X(0, [914,247], () => (__webpack_exec__(5549)));
module.exports = __webpack_exports__;

})();