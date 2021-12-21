"use strict";
(() => {
var exports = {};
exports.id = 28;
exports.ids = [28];
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

/***/ 7026:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8914);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9926);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);


const requestValidation = zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
        pushid: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().optional()
    })
});
/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */ const webhook = async ({ backgroundContext: ctx , req , res ,  })=>{
    const { query: { pushid  } ,  } = req;
    ctx.logger.info("Incoming webhook from dpd", {
        pushid
    });
    if (pushid) {
        res.setHeader("Content-Type", "application/xml");
        res.send(`<push><pushid>${pushid}</pushid><status>OK</status></push>`);
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_0__/* .handleWebhook */ .q)({
    webhook,
    validation: {
        http: {
            allowedMethods: [
                "GET",
                "POST",
                "PUT",
                "OPTIONS"
            ]
        }
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
var __webpack_exports__ = __webpack_require__.X(0, [914], () => (__webpack_exec__(7026)));
module.exports = __webpack_exports__;

})();