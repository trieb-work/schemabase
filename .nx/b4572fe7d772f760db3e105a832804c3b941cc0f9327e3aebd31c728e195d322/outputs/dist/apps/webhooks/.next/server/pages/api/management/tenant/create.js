(function() {
var exports = {};
exports.id = 605;
exports.ids = [605];
exports.modules = {

/***/ 190:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eci_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(242);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(zod__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(881);




const requestValidation = zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
  query: zod__WEBPACK_IMPORTED_MODULE_1__.z.object({
    name: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()
  })
});
/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */

const webhook = async ({
  backgroundContext,
  req,
  res
}) => {
  const ctx = await (0,_eci_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
  const {
    query: {
      name
    }
  } = requestValidation.parse(req);
  ctx.logger.info("Creating new tenant", {
    name
  });
  const tenant = await ctx.prisma.tenant.create({
    data: {
      id: _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__/* .idGenerator.id */ .U.id("publicKey"),
      name
    }
  });
  res.json({
    status: "created",
    traceId: ctx.trace.id,
    tenant: tenant.id
  });
};

/* harmony default export */ __webpack_exports__["default"] = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_3__/* .handleWebhook */ .q)({
  webhook,
  validation: {
    http: {
      allowedMethods: ["POST"]
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

/***/ 212:
/***/ (function(module) {

"use strict";
module.exports = require("@prisma/client");;

/***/ }),

/***/ 376:
/***/ (function(module) {

"use strict";
module.exports = require("axios");;

/***/ }),

/***/ 435:
/***/ (function(module) {

"use strict";
module.exports = require("graphql-request");;

/***/ }),

/***/ 875:
/***/ (function(module) {

"use strict";
module.exports = require("graphql-tag");;

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
var __webpack_exports__ = __webpack_require__.X(0, [881,906], function() { return __webpack_exec__(190); });
module.exports = __webpack_exports__;

})();