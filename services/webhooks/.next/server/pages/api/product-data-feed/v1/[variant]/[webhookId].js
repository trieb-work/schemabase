"use strict";
(() => {
var exports = {};
exports.id = 889;
exports.ids = [889];
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

/***/ 3965:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "u": () => (/* reexport */ ProductDataFeedGenerator)
});

;// CONCATENATED MODULE: external "objects-to-csv"
const external_objects_to_csv_namespaceObject = require("objects-to-csv");
var external_objects_to_csv_default = /*#__PURE__*/__webpack_require__.n(external_objects_to_csv_namespaceObject);
;// CONCATENATED MODULE: external "html-to-text"
const external_html_to_text_namespaceObject = require("html-to-text");
;// CONCATENATED MODULE: external "@editorjs/editorjs"
const editorjs_namespaceObject = require("@editorjs/editorjs");
;// CONCATENATED MODULE: ../../pkg/integration-saleor-product-data-feed/src/editorjs/app.ts

const parser = (plugins = {
})=>{
    const parsers = Object.assign({
    }, transforms, plugins);
    return {
        parse: ({ blocks  })=>{
            return blocks.map((block)=>{
                return parsers[block.type] ? parsers[block.type](block) : ParseFunctionError(block.type);
            });
        },
        parseBlock: (block)=>{
            return parsers[block.type] ? parsers[block.type](block) : ParseFunctionError(block.type);
        },
        parseStrict: ({ blocks  })=>{
            const parserFreeBlocks = parser(parsers).validate({
                blocks
            });
            if (parserFreeBlocks.length) {
                throw new Error(`Parser Functions missing for blocks: ${parserFreeBlocks.toString()}`);
            }
            const parsed = [];
            for(let i = 0; i < blocks.length; i++){
                if (!parsers[blocks[i].type]) throw ParseFunctionError(blocks[i].type);
                parsed.push(parsers[blocks[i].type](blocks[i]));
            }
            return parsed;
        },
        validate: ({ blocks  })=>{
            const types = blocks.map((item)=>item.type
            ).filter((item, index, blocksArr)=>blocksArr.indexOf(item) === index
            );
            const parser_keys = Object.keys(parsers);
            return types.filter((type)=>!parser_keys.includes(type)
            );
        }
    };
};
/* harmony default export */ const app = (parser);
function ParseFunctionError(type) {
    return new Error(`\x1b[31m The Parser function of type "${type}" is not defined. \n
  Define your custom parser functions as: \x1b[34mhttps://github.com/pavittarx/editorjs-html#extend-for-custom-blocks \x1b[0m`);
}
const transforms = {
    delimiter: ()=>{
        return `<br/>`;
    },
    header: ({ data  })=>{
        return `<h${data.level}>${data.text}</h${data.level}>`;
    },
    paragraph: ({ data  })=>{
        return `<p>${data.text}</p>`;
    },
    list: ({ data  })=>{
        const listStyle1 = data.style === "unordered" ? "ul" : "ol";
        const recursor = (items, listStyle)=>{
            const list1 = items.map((item)=>{
                if (!item.content && !item.items) return `<li>${item}</li>`;
                let list = "";
                if (item.items) list = recursor(item.items, listStyle);
                if (item.content) return `<li> ${item.content} </li>` + list;
                return list;
            });
            return `<${listStyle}>${list1.join("")}</${listStyle}>`;
        };
        return recursor(data.items, listStyle1);
    },
    image: ({ data  })=>{
        let caption = data.caption ? data.caption : "Image";
        return `<img src="${data.file && data.file.url ? data.file.url : data.url}" alt="${caption}" />`;
    },
    quote: ({ data  })=>{
        return `<blockquote>${data.text}</blockquote> - ${data.caption}`;
    },
    code: ({ data  })=>{
        return `<pre><code>${data.code}</code></pre>`;
    },
    embed: ({ data  })=>{
        switch(data.service){
            case "vimeo":
                return `<iframe src="${data.embed}" height="${data.height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
            case "youtube":
                return `<iframe width="${data.width}" height="${data.height}" src="${data.embed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            default:
                throw new Error("Only Youtube and Vime Embeds are supported right now.");
        }
    }
};

;// CONCATENATED MODULE: ../../pkg/integration-saleor-product-data-feed/src/generate-unit-price.ts
const generateUnitPrice = (variantWeight, productWeight)=>{
    if (!(variantWeight === null || variantWeight === void 0 ? void 0 : variantWeight.value) && !(productWeight === null || productWeight === void 0 ? void 0 : productWeight.value)) {
        return undefined;
    }
    return (variantWeight === null || variantWeight === void 0 ? void 0 : variantWeight.value) ? `${variantWeight.value} ${variantWeight.unit}` : `${productWeight.value} ${productWeight.unit}`;
};

;// CONCATENATED MODULE: ../../pkg/integration-saleor-product-data-feed/src/service.ts




/**
 * Generate product data as .csv
 */ class ProductDataFeedGenerator {
    constructor(config){
        this.saleorClient = config.saleorClient;
        this.channelSlug = config.channelSlug;
        this.logger = config.logger;
    }
    async generateCSV(storefrontProductUrl, feedVariant) {
        const products = await this.generate(storefrontProductUrl, feedVariant);
        const csv = new (external_objects_to_csv_default())(products);
        return await csv.toString();
    }
    async generate(storefrontProductUrl1, feedVariant1) {
        var ref, ref1;
        this.logger.debug("Fetching products from saleor");
        const res = await this.saleorClient.products({
            first: 100,
            channel: this.channelSlug
        });
        if (!res) {
            throw new Error("Unable to load products");
        }
        this.logger.debug(`Found ${((ref = res.products) === null || ref === void 0 ? void 0 : ref.edges.length) ?? 0} products`);
        const rawProducts = ((ref1 = res.products) === null || ref1 === void 0 ? void 0 : ref1.edges.map((edge)=>edge.node
        )) ?? [];
        const products = [];
        for (const rawProduct of rawProducts){
            var ref2, ref3, ref4, ref5;
            // we get the brand from a product attribute called brand
            const brand = (ref3 = (ref2 = rawProduct.attributes.find((x)=>x.attribute.name === "brand"
            )) === null || ref2 === void 0 ? void 0 : ref2.values[0]) === null || ref3 === void 0 ? void 0 : ref3.name;
            const googleProductCategory = (ref5 = (ref4 = rawProduct.attributes.find((x)=>x.attribute.name === "googleProductCategory"
            )) === null || ref4 === void 0 ? void 0 : ref4.values[0]) === null || ref5 === void 0 ? void 0 : ref5.name;
            // if we want to prefer the title instead of the seoTitle
            // const title = product.name ? product.name : product.seoTitle;
            const title = rawProduct.seoTitle ? rawProduct.seoTitle : rawProduct.name;
            let description = "";
            try {
                /**
         * `description` looks like this:
         * -> "{\"time\": 1633343031152, \"blocks\": [{\"data\": {\"text\": \"Hello world\"}, \"type\": \"paragraph\"}], \"version\": \"2.20.0\"}"
         *
         * `edjsHTML().parse(JSON.parse(description))` will return an array
         * -> [ "<p>Hello World</p>" ]
         */ description = rawProduct.description ? app().parse(JSON.parse(rawProduct.description)).join("") : rawProduct.seoDescription ?? "";
            } catch (err) {
                this.logger.warn("Unable to parse description", {
                    description: rawProduct.description,
                    err
                });
            }
            const { hasVariants  } = rawProduct.productType;
            if (!rawProduct.variants) {
                continue;
            }
            for (const variant of rawProduct.variants){
                var ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref20, ref21, ref22, ref23;
                if (!variant) {
                    continue;
                }
                const gtin = hasVariants ? (ref7 = (ref6 = variant.metadata) === null || ref6 === void 0 ? void 0 : ref6.find((x)=>{
                    return (x === null || x === void 0 ? void 0 : x.key) === "EAN";
                })) === null || ref7 === void 0 ? void 0 : ref7.value : (ref9 = (ref8 = rawProduct.metadata) === null || ref8 === void 0 ? void 0 : ref8.find((x)=>{
                    return (x === null || x === void 0 ? void 0 : x.key) === "EAN";
                })) === null || ref9 === void 0 ? void 0 : ref9.value;
                const unit_pricing_measure = variant.weight && rawProduct.weight ? generateUnitPrice(variant.weight, rawProduct.weight) : undefined;
                const product = {
                    id: variant.sku,
                    title: hasVariants ? `${title} (${variant.name})` : title,
                    description: (0,external_html_to_text_namespaceObject.htmlToText)(description),
                    image_link: hasVariants ? variant.images && variant.images.length > 0 ? (ref10 = variant.images[0]) === null || ref10 === void 0 ? void 0 : ref10.url : "" : rawProduct.images && rawProduct.images.length > 0 ? (ref11 = rawProduct.images[1]) === null || ref11 === void 0 ? void 0 : ref11.url : "",
                    additional_image_link: hasVariants ? (ref12 = variant.images) === null || ref12 === void 0 ? void 0 : (ref13 = ref12[1]) === null || ref13 === void 0 ? void 0 : ref13.url : (ref14 = rawProduct.images) === null || ref14 === void 0 ? void 0 : (ref15 = ref14[2]) === null || ref15 === void 0 ? void 0 : ref15.url,
                    link: `${storefrontProductUrl1}${storefrontProductUrl1.endsWith("/") ? "" : "/"}${rawProduct.slug}`,
                    price: `${variant === null || variant === void 0 ? void 0 : (ref16 = variant.pricing) === null || ref16 === void 0 ? void 0 : (ref17 = ref16.priceUndiscounted) === null || ref17 === void 0 ? void 0 : ref17.gross.amount} ${variant === null || variant === void 0 ? void 0 : (ref18 = variant.pricing) === null || ref18 === void 0 ? void 0 : (ref19 = ref18.priceUndiscounted) === null || ref19 === void 0 ? void 0 : ref19.gross.currency}`,
                    sale_price: `${variant === null || variant === void 0 ? void 0 : (ref20 = variant.pricing) === null || ref20 === void 0 ? void 0 : (ref21 = ref20.price) === null || ref21 === void 0 ? void 0 : ref21.gross.amount} ${(ref22 = variant.pricing) === null || ref22 === void 0 ? void 0 : (ref23 = ref22.price) === null || ref23 === void 0 ? void 0 : ref23.gross.currency}`,
                    condition: "new",
                    gtin,
                    brand: brand ?? "undefined",
                    unit_pricing_measure,
                    availability: variant.quantityAvailable < 1 || !rawProduct.isAvailableForPurchase ? "out of stock" : "in stock",
                    google_product_category: googleProductCategory ?? undefined
                };
                if (feedVariant1 === "facebookcommerce") {
                    product.rich_text_description = description;
                }
                products.push(product);
            }
        }
        return products;
    }
}

;// CONCATENATED MODULE: ../../pkg/integration-saleor-product-data-feed/index.ts



/***/ }),

/***/ 4699:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5247);
/* harmony import */ var _eci_pkg_integration_saleor_product_data_feed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3965);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9926);
/* harmony import */ var _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0);
/* harmony import */ var _eci_pkg_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8914);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_5__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_3__]);
([_eci_pkg_http__WEBPACK_IMPORTED_MODULE_5__, _eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);






const requestValidation = zod__WEBPACK_IMPORTED_MODULE_3__.z.object({
    query: zod__WEBPACK_IMPORTED_MODULE_3__.z.object({
        webhookId: zod__WEBPACK_IMPORTED_MODULE_3__.z.string(),
        variant: zod__WEBPACK_IMPORTED_MODULE_3__.z["enum"]([
            "facebookcommerce",
            "googlemerchant"
        ])
    })
});
/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */ const webhook1 = async ({ backgroundContext , req , res ,  })=>{
    const { query: { webhookId , variant  } ,  } = req;
    const ctx = await (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .extendContext */ .sj)(backgroundContext, (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .setupPrisma */ .o7)());
    const webhook = await ctx.prisma.incomingProductDataFeedWebhook.findUnique({
        where: {
            id: webhookId
        },
        include: {
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
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_4__/* .HttpError */ .oo(404, `Webhook not found: ${webhookId}`);
    }
    const { productDataFeedApp  } = webhook;
    if (!productDataFeedApp) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_4__/* .HttpError */ .oo(400, "productDataFeedApp is not configured");
    }
    const { integration  } = productDataFeedApp;
    if (!integration) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_4__/* .HttpError */ .oo(400, "Integration is not configured");
    }
    /**
   * Ensure the integration is enabled and payed for
   */ (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .authorizeIntegration */ .Zz)(integration);
    ctx.logger.info("Creating new product datafeed");
    const { saleorApp  } = integration;
    if (!saleorApp.channelSlug) {
        throw new _eci_pkg_errors__WEBPACK_IMPORTED_MODULE_4__/* .HttpError */ .oo(500, `Saleor app does not have a channel configured: ${saleorApp}`);
    }
    const saleorClient = (0,_eci_pkg_webhook_context__WEBPACK_IMPORTED_MODULE_0__/* .newSaleorClient */ .Vy)(ctx, saleorApp.domain);
    const generator = new _eci_pkg_integration_saleor_product_data_feed__WEBPACK_IMPORTED_MODULE_1__/* .ProductDataFeedGenerator */ .u({
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
    res.setHeader("Content-Disposition", `attachment; filename=productdatafeed-${(0,crypto__WEBPACK_IMPORTED_MODULE_2__.createHash)("md5").update(products).digest("hex")}.csv`);
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.send(products);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_eci_pkg_http__WEBPACK_IMPORTED_MODULE_5__/* .handleWebhook */ .q)({
    webhook: webhook1,
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
var __webpack_require__ = require("../../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [914,247], () => (__webpack_exec__(4699)));
module.exports = __webpack_exports__;

})();