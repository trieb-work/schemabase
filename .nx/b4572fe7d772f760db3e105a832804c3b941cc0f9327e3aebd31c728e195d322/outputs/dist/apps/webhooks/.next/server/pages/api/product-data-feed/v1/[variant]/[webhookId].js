(function() {
var exports = {};
exports.id = 889;
exports.ids = [889];
exports.modules = {

/***/ 74:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _webhookId_; }
});

// EXTERNAL MODULE: ../../libs/context/src/index.ts + 5 modules
var src = __webpack_require__(906);
;// CONCATENATED MODULE: external "objects-to-csv"
var external_objects_to_csv_namespaceObject = require("objects-to-csv");;
var external_objects_to_csv_default = /*#__PURE__*/__webpack_require__.n(external_objects_to_csv_namespaceObject);
;// CONCATENATED MODULE: external "html-to-text"
var external_html_to_text_namespaceObject = require("html-to-text");;
;// CONCATENATED MODULE: external "editorjs-html"
var external_editorjs_html_namespaceObject = require("editorjs-html");;
var external_editorjs_html_default = /*#__PURE__*/__webpack_require__.n(external_editorjs_html_namespaceObject);
;// CONCATENATED MODULE: ../../libs/integrations/product-data-feed/src/lib/generate-unit-price.ts
const generateUnitPrice = (variantWeight, productWeight) => {
  if (!(variantWeight !== null && variantWeight !== void 0 && variantWeight.value) && !(productWeight !== null && productWeight !== void 0 && productWeight.value)) {
    return undefined;
  }

  return variantWeight !== null && variantWeight !== void 0 && variantWeight.value ? `${variantWeight.value} ${variantWeight.unit}` : `${productWeight.value} ${productWeight.unit}`;
};
;// CONCATENATED MODULE: ../../libs/integrations/product-data-feed/src/lib/service.ts
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



// @ts-expect-error it doesn't detec types for some reason



/**
 * Generate product data as .csv
 */
class ProductDataFeedGenerator {
  constructor(config) {
    _defineProperty(this, "saleorClient", void 0);

    _defineProperty(this, "channelSlug", void 0);

    _defineProperty(this, "logger", void 0);

    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
  }

  async generateCSV(storefrontProductUrl, feedVariant) {
    const products = await this.generate(storefrontProductUrl, feedVariant);
    const csv = new (external_objects_to_csv_default())(products);
    return await csv.toString();
  }

  async generate(storefrontProductUrl, feedVariant) {
    var _res$products$edges$l, _res$products, _res$products$edges$m, _res$products2;

    this.logger.info("Fetching products from saleor");
    const res = await this.saleorClient.products({
      first: 100,
      channel: this.channelSlug
    });

    if (!res) {
      throw new Error("Unable to load products");
    }

    this.logger.info(`Found ${(_res$products$edges$l = (_res$products = res.products) === null || _res$products === void 0 ? void 0 : _res$products.edges.length) !== null && _res$products$edges$l !== void 0 ? _res$products$edges$l : 0} products`);
    const rawProducts = (_res$products$edges$m = (_res$products2 = res.products) === null || _res$products2 === void 0 ? void 0 : _res$products2.edges.map(edge => edge.node)) !== null && _res$products$edges$m !== void 0 ? _res$products$edges$m : [];
    const products = [];

    for (const rawProduct of rawProducts) {
      var _rawProduct$attribute, _rawProduct$attribute2, _rawProduct$attribute3, _rawProduct$attribute4;

      // we get the brand from a product attribute called brand
      const brand = (_rawProduct$attribute = rawProduct.attributes.find(x => x.attribute.name === "brand")) === null || _rawProduct$attribute === void 0 ? void 0 : (_rawProduct$attribute2 = _rawProduct$attribute.values[0]) === null || _rawProduct$attribute2 === void 0 ? void 0 : _rawProduct$attribute2.name;
      const googleProductCategory = (_rawProduct$attribute3 = rawProduct.attributes.find(x => x.attribute.name === "googleProductCategory")) === null || _rawProduct$attribute3 === void 0 ? void 0 : (_rawProduct$attribute4 = _rawProduct$attribute3.values[0]) === null || _rawProduct$attribute4 === void 0 ? void 0 : _rawProduct$attribute4.name; // if we want to prefer the title instead of the seoTitle
      // const title = product.name ? product.name : product.seoTitle;

      const title = rawProduct.seoTitle ? rawProduct.seoTitle : rawProduct.name;
      let description = "";

      try {
        description = rawProduct.descriptionJson ? external_editorjs_html_default()().parse(JSON.parse(rawProduct.descriptionJson)) : rawProduct.seoDescription;
      } catch (err) {// console.warn(err)
      }

      const {
        hasVariants
      } = rawProduct.productType;

      if (!rawProduct.variants) {
        continue;
      }

      for (const variant of rawProduct.variants) {
        var _variant$metadata, _variant$metadata$fin, _rawProduct$metadata, _rawProduct$metadata$, _variant$images$, _rawProduct$images$, _variant$images, _variant$images$2, _rawProduct$images, _rawProduct$images$2, _variant$pricing, _variant$pricing$pric, _variant$pricing2, _variant$pricing2$pri, _variant$pricing3, _variant$pricing3$pri, _variant$pricing4, _variant$pricing4$pri;

        if (!variant) {
          continue;
        }

        const gtin = hasVariants ? (_variant$metadata = variant.metadata) === null || _variant$metadata === void 0 ? void 0 : (_variant$metadata$fin = _variant$metadata.find(x => (x === null || x === void 0 ? void 0 : x.key) === "EAN")) === null || _variant$metadata$fin === void 0 ? void 0 : _variant$metadata$fin.value : (_rawProduct$metadata = rawProduct.metadata) === null || _rawProduct$metadata === void 0 ? void 0 : (_rawProduct$metadata$ = _rawProduct$metadata.find(x => (x === null || x === void 0 ? void 0 : x.key) === "EAN")) === null || _rawProduct$metadata$ === void 0 ? void 0 : _rawProduct$metadata$.value;
        const unit_pricing_measure = variant.weight && rawProduct.weight ? generateUnitPrice(variant.weight, rawProduct.weight) : undefined;
        const product = {
          id: variant.sku,
          title: hasVariants ? `${title} (${variant.name})` : title,
          description: (0,external_html_to_text_namespaceObject.htmlToText)(description),
          rich_text_description: feedVariant === "facebookcommerce" ? description : undefined,
          image_link: hasVariants ? variant.images && variant.images.length > 0 ? (_variant$images$ = variant.images[0]) === null || _variant$images$ === void 0 ? void 0 : _variant$images$.url : "" : rawProduct.images && rawProduct.images.length > 0 ? (_rawProduct$images$ = rawProduct.images[1]) === null || _rawProduct$images$ === void 0 ? void 0 : _rawProduct$images$.url : "",
          additional_image_link: hasVariants ? (_variant$images = variant.images) === null || _variant$images === void 0 ? void 0 : (_variant$images$2 = _variant$images[1]) === null || _variant$images$2 === void 0 ? void 0 : _variant$images$2.url : (_rawProduct$images = rawProduct.images) === null || _rawProduct$images === void 0 ? void 0 : (_rawProduct$images$2 = _rawProduct$images[2]) === null || _rawProduct$images$2 === void 0 ? void 0 : _rawProduct$images$2.url,
          link: storefrontProductUrl + rawProduct.slug,
          price: `${variant === null || variant === void 0 ? void 0 : (_variant$pricing = variant.pricing) === null || _variant$pricing === void 0 ? void 0 : (_variant$pricing$pric = _variant$pricing.priceUndiscounted) === null || _variant$pricing$pric === void 0 ? void 0 : _variant$pricing$pric.gross.amount} ${variant === null || variant === void 0 ? void 0 : (_variant$pricing2 = variant.pricing) === null || _variant$pricing2 === void 0 ? void 0 : (_variant$pricing2$pri = _variant$pricing2.priceUndiscounted) === null || _variant$pricing2$pri === void 0 ? void 0 : _variant$pricing2$pri.gross.currency}`,
          sale_price: `${variant === null || variant === void 0 ? void 0 : (_variant$pricing3 = variant.pricing) === null || _variant$pricing3 === void 0 ? void 0 : (_variant$pricing3$pri = _variant$pricing3.price) === null || _variant$pricing3$pri === void 0 ? void 0 : _variant$pricing3$pri.gross.amount} ${(_variant$pricing4 = variant.pricing) === null || _variant$pricing4 === void 0 ? void 0 : (_variant$pricing4$pri = _variant$pricing4.price) === null || _variant$pricing4$pri === void 0 ? void 0 : _variant$pricing4$pri.gross.currency}`,
          condition: "new",
          gtin,
          brand: brand !== null && brand !== void 0 ? brand : "undefined",
          unit_pricing_measure,
          availability: variant.quantityAvailable < 1 || !rawProduct.isAvailableForPurchase ? "out of stock" : "in stock",
          google_product_category: googleProductCategory !== null && googleProductCategory !== void 0 ? googleProductCategory : undefined
        };
        products.push(product);
      }
    }

    return products;
  }

}
;// CONCATENATED MODULE: ../../libs/integrations/product-data-feed/src/index.ts

;// CONCATENATED MODULE: external "md5"
var external_md5_namespaceObject = require("md5");;
var external_md5_default = /*#__PURE__*/__webpack_require__.n(external_md5_namespaceObject);
// EXTERNAL MODULE: external "zod"
var external_zod_ = __webpack_require__(242);
// EXTERNAL MODULE: ../../libs/util/errors/src/index.ts + 4 modules
var errors_src = __webpack_require__(928);
// EXTERNAL MODULE: ../../libs/http/src/index.ts + 4 modules
var http_src = __webpack_require__(881);
;// CONCATENATED MODULE: ./pages/api/product-data-feed/v1/[variant]/[webhookId].ts






const requestValidation = external_zod_.z.object({
  query: external_zod_.z.object({
    webhookId: external_zod_.z.string(),
    variant: external_zod_.z.enum(["facebookcommerce", "googlemerchant"])
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
  const {
    query: {
      webhookId,
      variant
    }
  } = req;
  const ctx = await (0,src/* extendContext */.sj)(backgroundContext, (0,src/* setupPrisma */.o7)());
  const webhook = await ctx.prisma.incomingProductDataFeedWebhook.findUnique({
    where: {
      id: webhookId
    },
    include: {
      secret: true,
      productDataFeedApp: {
        include: {
          integration: {
            include: {
              subscription: true,
              saleorApp: true
            }
          }
        }
      }
    }
  });

  if (!webhook) {
    throw new errors_src/* HttpError */.oo(404, `Webhook not found: ${webhookId}`);
  }

  const {
    productDataFeedApp
  } = webhook;

  if (!productDataFeedApp) {
    throw new errors_src/* HttpError */.oo(400, "productDataFeedApp is not configured");
  }

  const {
    integration
  } = productDataFeedApp;

  if (!integration) {
    throw new errors_src/* HttpError */.oo(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */


  (0,src/* authorizeIntegration */.Zz)(integration);
  ctx.logger.info("Creating new product datafeed");
  const {
    saleorApp
  } = integration;

  if (!saleorApp.channelSlug) {
    throw new errors_src/* HttpError */.oo(500, `Saleor app does not have a channel configured: ${saleorApp}`);
  }

  const saleorClient = (0,src/* newSaleorClient */.Vy)(ctx, saleorApp.domain);
  const generator = new ProductDataFeedGenerator({
    saleorClient,
    channelSlug: saleorApp.channelSlug,
    logger: ctx.logger.with({
      saleor: {
        domain: saleorApp.domain,
        channel: saleorApp.channelSlug
      }
    })
  });
  const products = await generator.generateCSV(productDataFeedApp.productDetailStorefrontURL, variant);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=productdatafeed-${external_md5_default()(products)}.csv`);
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.send(products);
};

/* harmony default export */ var _webhookId_ = ((0,http_src/* handleWebhook */.q)({
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
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [881,906], function() { return __webpack_exec__(74); });
module.exports = __webpack_exports__;

})();