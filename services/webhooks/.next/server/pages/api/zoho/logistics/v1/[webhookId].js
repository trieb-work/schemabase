"use strict";
(() => {
var exports = {};
exports.id = 638;
exports.ids = [638];
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

/***/ 5853:
/***/ ((module) => {

module.exports = require("@trieb.work/zoho-ts");

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

/***/ 8170:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "e": () => (/* reexport */ LogisticStats)
});

// EXTERNAL MODULE: ../../pkg/errors/index.ts + 4 modules
var errors = __webpack_require__(0);
;// CONCATENATED MODULE: ../../pkg/integration-zoho-logistics/src/integrations-zoho-logistics.ts

class LogisticStats {
    constructor(config){
        this.zoho = config.zoho;
        this.logger = config.logger.with({
            integration: "zoho-logistics"
        });
        this.customFields = config.customFields;
    }
    static async new(config1) {
        const instance = new LogisticStats(config1);
        if (!config1.customFields.currentBulkOrders) {
            throw new errors/* HttpError */.oo(500, "customFields.currentBulkOrders config is missing!");
        }
        if (!config1.customFields.currentOrdersReadyToFulfill) {
            throw new errors/* HttpError */.oo(500, "customFields.currentOrdersReadyToFulfill config is missing!");
        }
        await instance.zoho.authenticate();
        return instance;
    }
    async getCurrentPackageStats() {
        this.logger.debug("fetching salesorders from Zoho");
        const now = new Date().toUTCString();
        const currentOrdersReady = (await this.zoho.searchSalesOrdersWithScrolling({
            customViewID: this.customFields.currentOrdersReadyToFulfill
        })).length;
        const currentBulkOrders = (await this.zoho.searchSalesOrdersWithScrolling({
            customViewID: this.customFields.currentBulkOrders
        })).length;
        const nextFiveDaysOrders = (await this.zoho.searchSalesOrdersWithScrolling({
            customViewID: this.customFields.nextFiveDaysOrders
        })).length;
        const nextFiveDaysBulkOrders = (await this.zoho.searchSalesOrdersWithScrolling({
            customViewID: this.customFields.nextFiveDaysBulkOrders
        })).length;
        return {
            orders: {
                ready_to_fulfill: {
                    current: currentOrdersReady,
                    next_five_days: nextFiveDaysOrders
                },
                bulk_orders: {
                    current: currentBulkOrders,
                    next_five_days: nextFiveDaysBulkOrders
                },
                total: {
                    current: currentBulkOrders + currentOrdersReady,
                    next_five_days: nextFiveDaysOrders + nextFiveDaysBulkOrders
                }
            },
            creation_time: now
        };
    }
}

;// CONCATENATED MODULE: ../../pkg/integration-zoho-logistics/index.ts



/***/ }),

/***/ 9529:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9926);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8914);
/* harmony import */ var _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5247);
/* harmony import */ var _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);
/* harmony import */ var _eci_pkg_integration_zoho_logistics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8170);
/* harmony import */ var _trieb_work_zoho_ts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5853);
/* harmony import */ var _trieb_work_zoho_ts__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_trieb_work_zoho_ts__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_1__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__, zod__WEBPACK_IMPORTED_MODULE_0__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_1__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__, zod__WEBPACK_IMPORTED_MODULE_0__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);






const requestValidation = zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_0__.z.object({
        webhookId: zod__WEBPACK_IMPORTED_MODULE_0__.z.string()
    }),
    method: zod__WEBPACK_IMPORTED_MODULE_0__.z.string()
});
const webhook1 = async ({ req , res , backgroundContext ,  })=>{
    const { query: { webhookId  } , method ,  } = req;
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    // pre-flight requests get return
    if (method.toUpperCase() === "OPTIONS") {
        return;
    }
    const ctx = await (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__/* .extendContext */ .sj)(backgroundContext, (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__/* .setupPrisma */ .o7)());
    const webhook = await ctx.prisma.incomingLogisticsWebhook.findUnique({
        where: {
            id: webhookId
        },
        include: {
            logisticsApp: {
                include: {
                    integration: {
                        include: {
                            subscription: true,
                            zohoApp: true
                        }
                    }
                }
            }
        }
    });
    if (!webhook) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_3__/* .HttpError */ .oo(404, `Webhook not found: ${webhookId}`);
    }
    const { logisticsApp  } = webhook;
    if (!logisticsApp) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_3__/* .HttpError */ .oo(400, "strapi app is not configured");
    }
    const { integration  } = logisticsApp;
    if (!integration) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_3__/* .HttpError */ .oo(400, "Integration is not configured");
    }
    /**
   * Ensure the integration is enabled and payed for
   */ (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_2__/* .authorizeIntegration */ .Zz)(integration);
    const { zohoApp  } = integration;
    if (!zohoApp) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_3__/* .HttpError */ .oo(400, "Zoho connection not enabled");
    }
    const zoho = new _trieb_work_zoho_ts__WEBPACK_IMPORTED_MODULE_5__.ZohoClientInstance({
        zohoClientId: zohoApp.clientId,
        zohoClientSecret: zohoApp.clientSecret,
        zohoOrgId: zohoApp.orgId
    });
    const customFields = {
        currentOrdersReadyToFulfill: webhook.logisticsApp.currentOrdersCustomViewId,
        nextFiveDaysOrders: webhook.logisticsApp.nextFiveDaysOrdersCustomViewId,
        currentBulkOrders: webhook.logisticsApp.currentBulkOrdersCustomViewId,
        nextFiveDaysBulkOrders: webhook.logisticsApp.nextFiveDaysBulkOrdersCustomViewId
    };
    const handleRequest = await _eci_pkg_integration_zoho_logistics__WEBPACK_IMPORTED_MODULE_4__/* .LogisticStats["new"] */ .e["new"]({
        zoho,
        logger: ctx.logger,
        customFields
    });
    const responseData = await handleRequest.getCurrentPackageStats();
    const now = new Date().getHours();
    const cacheMaxAge = now >= 8 && now <= 17 ? 900 : 3600;
    res.setHeader("Cache-Control", `s-maxage=${cacheMaxAge}, stale-while-revalidate`);
    res.json(responseData);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_1__/* .handleWebhook */ .q)({
    webhook: webhook1,
    validation: {
        http: {
            allowedMethods: [
                "GET",
                "OPTIONS"
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
var __webpack_exports__ = __webpack_require__.X(0, [914,247], () => (__webpack_exec__(9529)));
module.exports = __webpack_exports__;

})();