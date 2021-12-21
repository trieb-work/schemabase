"use strict";
(() => {
var exports = {};
exports.id = 654;
exports.ids = [654];
exports.modules = {

/***/ 1415:
/***/ ((module) => {

module.exports = require("@chronark/prefixed-id");

/***/ }),

/***/ 9579:
/***/ ((module) => {

module.exports = require("@elastic/ecs-winston-format");

/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

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

/***/ 9459:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9926);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2684);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8914);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_2__, _chronark_env__WEBPACK_IMPORTED_MODULE_1__, zod__WEBPACK_IMPORTED_MODULE_0__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_2__, _chronark_env__WEBPACK_IMPORTED_MODULE_1__, zod__WEBPACK_IMPORTED_MODULE_0__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);



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
    const baseUrl = _chronark_env__WEBPACK_IMPORTED_MODULE_1__.env.require("ECI_BASE_URL");
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_2__/* .handleWebhook */ .q)({
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
var __webpack_exports__ = __webpack_require__.X(0, [914], () => (__webpack_exec__(9459)));
module.exports = __webpack_exports__;

})();