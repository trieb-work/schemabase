"use strict";
(() => {
var exports = {};
exports.id = 654;
exports.ids = [654];
exports.modules = {

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

/***/ 99459:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9926);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74824);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65400);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([zod__WEBPACK_IMPORTED_MODULE_0__]);
zod__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];



const requestValidation = zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
        tenantId: zod__WEBPACK_IMPORTED_MODULE_0__.z.string()
    })
});
/**
 * Return an app manifest including the tenantId
 */ const webhook = async ({ backgroundContext: ctx , req , res ,  })=>{
    const { query: { tenantId  } ,  } = req;
    ctx.logger = ctx.logger.with({
        tenantId
    });
    ctx.logger.info(`Manifest requested`);
    const baseUrl = _chronark_env__WEBPACK_IMPORTED_MODULE_1__/* .env.require */ .O.require("ECI_BASE_URL");
    const manifest = {
        id: "triebwork.eci",
        version: "1.0.0",
        name: "eCommerce Integrations for Saleor",
        about: "The trieb.work ECI for saleor is a powerful App used for several services like data synchronisation to Zoho Inventory, Mailchimp, an advanced product data feed etc.. ",
        permissions: [
            "MANAGE_APPS",
            "MANAGE_SHIPPING",
            "MANAGE_PRODUCTS",
            "MANAGE_ORDERS",
            "MANAGE_GIFT_CARD",
            "MANAGE_DISCOUNTS",
            "MANAGE_CHECKOUTS",
            "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", 
        ],
        appUrl: "http://localhost:3000/app",
        configurationUrl: `${baseUrl}/saleor/configuration/${tenantId}`,
        tokenTargetUrl: `${baseUrl}/api/saleor/register/${tenantId}`,
        dataPrivacy: "Lorem ipsum",
        dataPrivacyUrl: "http://localhost:3000/app-data-privacy",
        homepageUrl: "https://trieb.work",
        supportUrl: "http://localhost:3000/support"
    };
    res.json(manifest);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_2__/* .handleWebhook */ .q)({
    webhook,
    validation: {
        http: {
            allowedMethods: [
                "GET"
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
var __webpack_exports__ = __webpack_require__.X(0, [938,172], () => (__webpack_exec__(99459)));
module.exports = __webpack_exports__;

})();