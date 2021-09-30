(function() {
var exports = {};
exports.id = 867;
exports.ids = [867];
exports.modules = {

/***/ 211:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eci_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(242);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(zod__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(655);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_chronark_env__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _eci_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(881);
/* harmony import */ var _eci_util_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(928);
/* harmony import */ var _eci_adapters_saleor_api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(799);







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
 */

const webhook = async ({
  backgroundContext,
  req,
  res
}) => {
  var _idResponse$app;

  const {
    query: {
      tenantId
    },
    headers,
    body: {
      auth_token: token
    }
  } = req;
  const ctx = await (0,_eci_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
  /**
   * Saleor in a container will not have a real domain, so we override it here :/
   * see https://github.com/trieb-work/eci/issues/88
   */

  const domain = headers["x-saleor-domain"].replace("localhost", "saleor.eci");
  ctx.logger = ctx.logger.with({
    tenantId,
    saleor: domain
  });
  ctx.logger.info("Registering app");
  const saleorClient = (0,_eci_context__WEBPACK_IMPORTED_MODULE_0__/* .newSaleorClient */ .Vy)(ctx, domain, token);
  const idResponse = await saleorClient.app();
  ctx.logger.info("app", {
    idResponse
  });

  if (!((_idResponse$app = idResponse.app) !== null && _idResponse$app !== void 0 && _idResponse$app.id)) {
    throw new _eci_util_errors__WEBPACK_IMPORTED_MODULE_5__/* .HttpError */ .oo(500, "No app found");
  }

  const app = await ctx.prisma.installedSaleorApp.create({
    data: {
      id: idResponse.app.id,
      token,
      webhooks: {
        create: {
          id: _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__/* .idGenerator.id */ .U.id("publicKey"),
          secret: {
            create: {
              id: _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__/* .idGenerator.id */ .U.id("publicKey"),
              secret: _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__/* .idGenerator.id */ .U.id("secretKey")
            }
          }
        }
      },
      saleorApp: {
        create: {
          id: _eci_util_ids__WEBPACK_IMPORTED_MODULE_2__/* .idGenerator.id */ .U.id("publicKey"),
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
  const webhook = await saleorClient.webhookCreate({
    input: {
      targetUrl: `${_chronark_env__WEBPACK_IMPORTED_MODULE_3__.env.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${app.webhooks[0].id}`,
      events: [_eci_adapters_saleor_api__WEBPACK_IMPORTED_MODULE_6__/* .WebhookEventTypeEnum.AnyEvents */ .zq.AnyEvents],
      secretKey: app.webhooks[0].secret.secret,
      isActive: true,
      app: app.id
    }
  });
  ctx.logger.info("Added webhook to saleor", {
    webhook
  });
  res.json({
    status: "received",
    traceId: ctx.trace.id
  });
};

/* harmony default export */ __webpack_exports__["default"] = ((0,_eci_http__WEBPACK_IMPORTED_MODULE_4__/* .handleWebhook */ .q)({
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
var __webpack_exports__ = __webpack_require__.X(0, [881,906], function() { return __webpack_exec__(211); });
module.exports = __webpack_exports__;

})();