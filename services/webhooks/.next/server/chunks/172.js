exports.id = 172;
exports.ids = [172];
exports.modules = {

/***/ 29810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./@elastic/elasticsearch.js": 29873,
	"./apollo-server-core.js": 60669,
	"./aws-sdk.js": 82202,
	"./aws-sdk/dynamodb.js": 87487,
	"./aws-sdk/s3.js": 15778,
	"./aws-sdk/sns.js": 23323,
	"./aws-sdk/sqs.js": 9578,
	"./bluebird.js": 75698,
	"./cassandra-driver.js": 86870,
	"./elasticsearch.js": 31073,
	"./express-graphql.js": 11798,
	"./express-queue.js": 46309,
	"./express.js": 19341,
	"./fastify.js": 9437,
	"./finalhandler.js": 9505,
	"./generic-pool.js": 30549,
	"./graphql.js": 32551,
	"./handlebars.js": 41005,
	"./hapi.js": 33896,
	"./http.js": 35516,
	"./http2.js": 78046,
	"./https.js": 39117,
	"./ioredis.js": 42619,
	"./jade.js": 27593,
	"./knex.js": 35779,
	"./koa-router.js": 24296,
	"./koa.js": 50797,
	"./memcached.js": 86388,
	"./mimic-response.js": 82469,
	"./mongodb-core.js": 3157,
	"./mongodb.js": 31216,
	"./mysql.js": 61156,
	"./mysql2.js": 48711,
	"./pg.js": 34388,
	"./pug.js": 95754,
	"./redis.js": 78073,
	"./restify.js": 4741,
	"./tedious.js": 40164,
	"./ws.js": 28686
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 29810;

/***/ }),

/***/ 92840:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 92840;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 1626:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 1626;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 65166:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": () => (/* binding */ ECI_TRACE_HEADER)
/* harmony export */ });
/**
 * The header name where we read and write the traceid
 */ const ECI_TRACE_HEADER = "eci-trace-id";


/***/ }),

/***/ 69523:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "fs": () => (/* reexport */ ContextMissingFieldError),
  "pY": () => (/* reexport */ base_GenericError),
  "oo": () => (/* reexport */ HttpError)
});

// UNUSED EXPORTS: EnvironmentVariableNotFoundError

;// CONCATENATED MODULE: ../../pkg/errors/src/base.ts
class base_GenericError extends Error {
    constructor(name, message){
        super(message);
        this.name = name;
    }
}

;// CONCATENATED MODULE: ../../pkg/errors/src/env.ts

class EnvironmentVariableNotFoundError extends (/* unused pure expression or super */ null && (GenericError)) {
    /**
   * @param name - The name of the environment variable
   */ constructor(name){
        super("EnvironmentNotFoundError", `Environment variable "${name}" not found.`);
    }
}

;// CONCATENATED MODULE: ../../pkg/errors/src/http.ts

/**
 * HttpError is used to pass a status code inside nextjs api routes.
 */ class HttpError extends base_GenericError {
    constructor(statusCode, message = "HttpError"){
        super("HttpError", message);
        this.statusCode = statusCode;
    }
}

;// CONCATENATED MODULE: ../../pkg/errors/src/context.ts

class ContextMissingFieldError extends base_GenericError {
    /**
   * @param missingField - The name field that was not set up properly before.
   */ constructor(missingField){
        super("ContextMissingFieldError", `The context is missing a required field: ${missingField}. Is the context set up in the correct order?`);
    }
}

;// CONCATENATED MODULE: ../../pkg/errors/index.ts






/***/ }),

/***/ 65400:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": () => (/* reexport */ handleWebhook)
});

// UNUSED EXPORTS: HttpClient

// EXTERNAL MODULE: ../../node_modules/.pnpm/winston@3.3.3/node_modules/winston/lib/winston.js
var winston = __webpack_require__(52928);
var winston_default = /*#__PURE__*/__webpack_require__.n(winston);
// EXTERNAL MODULE: ../../node_modules/.pnpm/winston-elasticsearch@0.16.0/node_modules/winston-elasticsearch/index.js
var winston_elasticsearch = __webpack_require__(30466);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@chronark+env@0.1.2/node_modules/@chronark/env/esm/mod.js + 2 modules
var mod = __webpack_require__(74824);
// EXTERNAL MODULE: ../../node_modules/.pnpm/@elastic+ecs-winston-format@1.3.1/node_modules/@elastic/ecs-winston-format/index.js
var ecs_winston_format = __webpack_require__(25760);
var ecs_winston_format_default = /*#__PURE__*/__webpack_require__.n(ecs_winston_format);
;// CONCATENATED MODULE: ../../pkg/logger/src/logger.ts




class Logger {
    constructor(config){
        this.logDrains = [];
        this.meta = {
            env: mod/* env.require */.O.require("ECI_ENV"),
            commit: mod/* env.get */.O.get("GIT_COMMIT_SHA", mod/* env.get */.O.get("VERCEL_GIT_COMMIT_SHA")),
            ...config === null || config === void 0 ? void 0 : config.meta
        };
        this.logger = winston_default().createLogger({
            transports: [
                new (winston_default()).transports.Console()
            ],
            format: winston_default().format.prettyPrint({
                colorize: true,
                depth: 10
            })
        });
        if (this.meta["env"] === "production") {
            this.debug("Enabling elastic transport");
            // this.apm ??= APMAgent.start({ serviceName: "eci-v2" });
            /**
       * ECS requires a special logging format.
       * This overwrites the prettyprint or json format.
       *
       * @see https://www.elastic.co/guide/en/ecs-logging/nodejs/current/winston.html
       */ this.logger.format = ecs_winston_format_default()({
                convertReqRes: true
            });
            /**
       * Ships all our logs to elasticsearch
       */ this.elasticSearchTransport = new winston_elasticsearch.ElasticsearchTransport({
                level: "info",
                dataStream: true,
                clientOpts: {
                    node: mod/* env.require */.O.require("ELASTIC_LOGGING_SERVER"),
                    auth: {
                        username: mod/* env.require */.O.require("ELASTIC_LOGGING_USERNAME"),
                        password: mod/* env.require */.O.require("ELASTIC_LOGGING_PASSWORD")
                    }
                }
            });
            this.logger.add(this.elasticSearchTransport);
        }
    }
    withLogDrain(logDrain) {
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.logDrains.push(logDrain);
        return copy;
    }
    /**
   * Create a child logger with more metadata to be logged.
   * Existing metadata is carried over unless overwritten
   */ with(additionalMeta) {
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.meta = {
            ...this.meta,
            ...additionalMeta
        };
        return copy;
    }
    /**
   * Serialize the message
   *
   * The fields will overwrite the default metadata if keys overlap.
   */ log(level, message, fields) {
        this.logger.log(level, message, {
            ...this.meta,
            ...fields
        });
        for (const logDrain of this.logDrains){
            logDrain.log(JSON.stringify({
                level,
                message,
                ...this.meta,
                ...fields
            }, null, 2));
        }
    }
    debug(message1, fields1 = {
    }) {
        return this.log("debug", message1, fields1);
    }
    info(message2, fields2 = {
    }) {
        return this.log("info", message2, fields2);
    }
    warn(message3, fields3 = {
    }) {
        return this.log("warn", message3, fields3);
    }
    error(message4, fields4 = {
    }) {
        return this.log("error", message4, fields4);
    }
    async flush() {
        var ref;
        await Promise.all([
            (ref = this.elasticSearchTransport) === null || ref === void 0 ? void 0 : ref.flush()
        ]);
    }
}

;// CONCATENATED MODULE: ../../pkg/logger/index.ts



// EXTERNAL MODULE: ../../pkg/ids/index.ts + 1 modules
var ids = __webpack_require__(26240);
// EXTERNAL MODULE: ../../pkg/errors/index.ts + 4 modules
var errors = __webpack_require__(69523);
// EXTERNAL MODULE: ../../pkg/constants/src/headers.ts
var headers = __webpack_require__(65166);
;// CONCATENATED MODULE: ../../pkg/http/src/eciApiHandler.ts




/**
 * Provides the webhook with a logger and handles thrown errors gracefully.
 *
 * This will end the request automatically. Do not call `res.end()` yourself!
 * Simply finish your handler with `res.send()` or `res.json()` if you need to
 * return something.
 */ function handleWebhook({ webhook , validation  }) {
    return async (req, res)=>{
        /**
     * Not all webhooks will send the Content-Type header so we need to
     * parse the body manually.
     */ if (typeof req.body === "string") {
            try {
                req.body = JSON.parse(req.body);
            } catch (err) {
            // Do nothing
            }
        }
        /**
     * A unique id for this trace. This is useful for searching the logs.
     */ const traceId = req.headers[headers/* ECI_TRACE_HEADER */.X] ?? ids.id.id("trace");
        res.setHeader(headers/* ECI_TRACE_HEADER */.X, traceId);
        const logger = new Logger({
            meta: {
                traceId,
                endpoint: req.url
            }
        });
        const backgroundContext = {
            trace: {
                id: traceId
            },
            logger
        };
        try {
            /**
       * Perform http validation
       */ if (validation.http) {
                if (!validation.http.allowedMethods.includes(req.method)) {
                    res.setHeader("Allow", validation.http.allowedMethods.join(", "));
                    throw new errors/* HttpError */.oo(405, `${req.method} is not allowed`);
                }
            }
            /**
       * Perform request validation
       */ if (validation.request) {
                await validation.request.parseAsync(req).catch((err)=>{
                    throw new errors/* HttpError */.oo(400, err.message);
                });
            }
            /**
       * Run the actual webhook logic
       */ await webhook({
                backgroundContext,
                req: req,
                res
            });
        /**
       * Handle errors gracefully
       */ } catch (error) {
            const err = error;
            logger.error(err.message);
            res.status(err instanceof errors/* HttpError */.oo ? err.statusCode : 500);
            res.json({
                error: "Something went wrong",
                traceId
            });
        } finally{
            await logger.flush();
            res.end();
        }
    };
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js
var node_modules_axios = __webpack_require__(5559);
;// CONCATENATED MODULE: ../../pkg/http/src/http.ts
// eslint-disable-next-line no-restricted-imports


class HttpClient {
    constructor(config){
        this.headers = {
        };
        if (config === null || config === void 0 ? void 0 : config.traceId) {
            this.setHeader(ECI_TRACE_HEADER, config.traceId);
        }
    }
    setHeader(name, value) {
        this.headers[name] = value;
    }
    async call(req) {
        return await axios({
            method: req.method,
            url: req.url,
            params: req.params,
            headers: {
                ...this.headers,
                ...req.headers
            },
            data: req.body
        }).then((res)=>({
                status: res.status,
                data: res.data ?? null,
                headers: res.headers
            })
        ).catch((err)=>{
            if (!err.response) {
                throw err;
            }
            return {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            };
        });
    }
}

;// CONCATENATED MODULE: ../../pkg/http/index.ts




/***/ }),

/***/ 26240:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "id": () => (/* reexport */ id)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@chronark+prefixed-id@0.3.8/node_modules/@chronark/prefixed-id/src/index.js
var src = __webpack_require__(38340);
;// CONCATENATED MODULE: ../../pkg/ids/src/id.ts

const prefixes = {
    message: "m",
    trace: "tr",
    secretKey: "sk",
    publicKey: "pk",
    /**
   * Only used in automatic tests
   */ test: "test"
};
const id = new src.IdGenerator(prefixes);

;// CONCATENATED MODULE: ../../pkg/ids/index.ts



/***/ })

};
;