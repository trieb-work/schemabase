(function() {
var exports = {};
exports.id = 654;
exports.ids = [654];
exports.modules = {

/***/ 777:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(242);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zod__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(655);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chronark_env__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(881);



const requestValidation = zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
  query: zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
    tenantId: zod__WEBPACK_IMPORTED_MODULE_0__.z.string()
  })
});
/**
 * Return an app manifest including the tenantId
 */

const webhook = async ({
  backgroundContext: ctx,
  req,
  res
}) => {
  const {
    query: {
      tenantId
    }
  } = req;
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
    permissions: ["MANAGE_APPS", "MANAGE_SHIPPING", "MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_GIFT_CARD", "MANAGE_DISCOUNTS", "MANAGE_CHECKOUTS", "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"],
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

/* harmony default export */ __webpack_exports__["default"] = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_2__/* .handleWebhook */ .q)({
  webhook,
  validation: {
    http: {
      allowedMethods: ["GET"]
    },
    request: requestValidation
  }
}));

/***/ }),

/***/ 655:
/***/ (function(module) {

"use strict";
module.exports = require("@chronark/env");;

/***/ }),

/***/ 110:
/***/ (function(module) {

"use strict";
module.exports = require("@chronark/prefixed-id");;

/***/ }),

/***/ 126:
/***/ (function(module) {

"use strict";
module.exports = require("@elastic/ecs-winston-format");;

/***/ }),

/***/ 376:
/***/ (function(module) {

"use strict";
module.exports = require("axios");;

/***/ }),

/***/ 944:
/***/ (function(module) {

"use strict";
module.exports = require("winston");;

/***/ }),

/***/ 96:
/***/ (function(module) {

"use strict";
module.exports = require("winston-elasticsearch");;

/***/ }),

/***/ 242:
/***/ (function(module) {

"use strict";
module.exports = require("zod");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [881], function() { return __webpack_exec__(777); });
module.exports = __webpack_exports__;

})();