"use strict";
(() => {
var exports = {};
exports.id = 663;
exports.ids = [663];
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

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 5676:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5247);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9926);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8914);
/* harmony import */ var _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4497);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_2__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_3__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);





const requestValidation = zod__WEBPACK_IMPORTED_MODULE_2__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_2__.z.object({
        strapiId: zod__WEBPACK_IMPORTED_MODULE_2__.z.string()
    })
});
const webhook1 = async ({ backgroundContext , req , res ,  })=>{
    const { query: { strapiId  } ,  } = req;
    const ctx = await (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
    const secret = _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_4__.id.id("secretKey");
    const webhook = await ctx.prisma.incomingStrapiWebhook.create({
        data: {
            id: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_4__.id.id("publicKey"),
            strapiApp: {
                connect: {
                    id: strapiId
                }
            },
            secret: {
                create: {
                    id: _eci_pkg_ids__WEBPACK_IMPORTED_MODULE_4__.id.id("publicKey"),
                    secret: (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256").update(secret).digest("hex")
                }
            }
        }
    });
    res.json({
        status: "received",
        traceId: ctx.trace.id,
        webhookId: webhook.id,
        webhookSecret: secret,
        path: `/api/strapi/webhook/${webhook.id}`
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
var __webpack_require__ = require("../../../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [914,247], () => (__webpack_exec__(5676)));
module.exports = __webpack_exports__;

})();