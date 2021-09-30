exports.id = 881;
exports.ids = [881];
exports.modules = {

/***/ 881:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": function() { return /* reexport */ handleWebhook; }
});

// UNUSED EXPORTS: HttpClient

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(376);
;// CONCATENATED MODULE: ../../libs/http/src/lib/http.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line no-restricted-imports


class HttpClient {
  constructor(config) {
    _defineProperty(this, "headers", void 0);

    this.headers = {};

    if (config !== null && config !== void 0 && config.traceId) {
      this.setHeader(ECI_TRACE_HEADER, config === null || config === void 0 ? void 0 : config.traceId);
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
      headers: _objectSpread(_objectSpread({}, this.headers), req.headers),
      data: JSON.stringify(req.body)
    }).then(res => {
      var _res$data;

      return {
        status: res.status,
        data: (_res$data = res.data) !== null && _res$data !== void 0 ? _res$data : null,
        headers: res.headers
      };
    });
  }

}
// EXTERNAL MODULE: external "winston"
var external_winston_ = __webpack_require__(944);
var external_winston_default = /*#__PURE__*/__webpack_require__.n(external_winston_);
// EXTERNAL MODULE: external "winston-elasticsearch"
var external_winston_elasticsearch_ = __webpack_require__(96);
// EXTERNAL MODULE: external "@chronark/env"
var env_ = __webpack_require__(655);
// EXTERNAL MODULE: external "@elastic/ecs-winston-format"
var ecs_winston_format_ = __webpack_require__(126);
var ecs_winston_format_default = /*#__PURE__*/__webpack_require__.n(ecs_winston_format_);
;// CONCATENATED MODULE: ../../libs/util/logger/src/lib/logger.ts
function logger_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function logger_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { logger_ownKeys(Object(source), true).forEach(function (key) { logger_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { logger_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function logger_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Logger {
  constructor(config) {
    logger_defineProperty(this, "logger", void 0);

    logger_defineProperty(this, "meta", void 0);

    logger_defineProperty(this, "elasticSearchTransport", void 0);

    logger_defineProperty(this, "apm", void 0);

    this.meta = logger_objectSpread(logger_objectSpread({}, config === null || config === void 0 ? void 0 : config.meta), {}, {
      env: env_.env.get("NODE_ENV"),
      commit: env_.env.get("VERCEL_GIT_COMMIT_SHA")
    });
    this.logger = external_winston_default().createLogger({
      transports: [new (external_winston_default()).transports.Console()],
      format: env_.env.get("NODE_ENV") === "production" ? external_winston_default().format.json() : external_winston_default().format.prettyPrint({
        colorize: true
      })
    });
    const isCI = env_.env.get("CI") === "true";

    if (!isCI && config !== null && config !== void 0 && config.enableElastic) {
      this.debug("Enabling elastic transport"); // this.apm ??= APMAgent.start({ serviceName: "eci-v2" });

      /**
       * ECS requires a special logging format.
       * This overwrites the prettyprint or json format.
       *
       * @see https://www.elastic.co/guide/en/ecs-logging/nodejs/current/winston.html
       */

      this.logger.format = ecs_winston_format_default()({
        convertReqRes: true
      });
      /**
       * Ships all our logs to elasticsearch
       */

      this.elasticSearchTransport = new external_winston_elasticsearch_.ElasticsearchTransport({
        level: "info",
        // log info and above, not debug
        apm: this.apm,
        dataStream: true,
        clientOpts: {
          node: env_.env.require("ELASTIC_LOGGING_SERVER"),
          auth: {
            username: env_.env.require("ELASTIC_LOGGING_USERNAME"),
            password: env_.env.require("ELASTIC_LOGGING_PASSWORD")
          }
        }
      });
      this.logger.add(this.elasticSearchTransport);
    }
  }
  /**
   * Create a child logger with more metadata to be logged.
   * Existing metadata is carried over unless overwritten
   */


  with(additionalMeta) {
    const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    copy.meta = logger_objectSpread(logger_objectSpread({}, this.meta), additionalMeta);
    return copy;
  }
  /**
   * Serialize the message
   *
   * The fields will overwrite the default metadata if keys overlap.
   */


  log(level, message, fields = {}) {
    this.logger.log(level, message, logger_objectSpread(logger_objectSpread({}, this.meta), fields));
  }

  debug(message, fields = {}) {
    return this.log("debug", message, fields);
  }

  info(message, fields = {}) {
    return this.log("info", message, fields);
  }

  warn(message, fields = {}) {
    return this.log("warn", message, fields);
  }

  error(message, fields = {}) {
    return this.log("error", message, fields);
  }

  async flush() {
    var _this$elasticSearchTr, _this$apm;

    await Promise.all([(_this$elasticSearchTr = this.elasticSearchTransport) === null || _this$elasticSearchTr === void 0 ? void 0 : _this$elasticSearchTr.flush(), (_this$apm = this.apm) === null || _this$apm === void 0 ? void 0 : _this$apm.flush()]);
  }

}
;// CONCATENATED MODULE: ../../libs/util/logger/src/index.ts


// EXTERNAL MODULE: ../../libs/util/ids/src/index.ts + 1 modules
var src = __webpack_require__(44);
// EXTERNAL MODULE: ../../libs/util/errors/src/index.ts + 4 modules
var errors_src = __webpack_require__(928);
// EXTERNAL MODULE: ../../libs/util/constants/src/lib/headers.ts
var headers = __webpack_require__(347);
;// CONCATENATED MODULE: ../../libs/http/src/lib/eciApiHandler.ts






/**
 * Provides the webhook with a logger and handles thrown errors gracefully.
 *
 * This will end the request automatically. Do not call `res.end()` yourself!
 * Simply finish your handler with `res.send()` or `res.json()` if you need to
 * return something.
 */
function handleWebhook({
  webhook,
  validation
}) {
  return async (req, res) => {
    var _ref;

    /**
     * Not all webhooks will send the Content-Type header so we need to
     * parse the body manually.
     */
    if (typeof req.body === "string") {
      try {
        req.body = JSON.parse(req.body);
      } catch (err) {// Do nothing
      }
    }
    /**
     * A unique id for this trace. This is useful for searching the logs.
     */


    const traceId = (_ref = req.headers[headers/* ECI_TRACE_HEADER */.X]) !== null && _ref !== void 0 ? _ref : src/* idGenerator.id */.U.id("trace");
    res.setHeader(headers/* ECI_TRACE_HEADER */.X, traceId);
    const logger = new Logger({
      enableElastic: env_.env.get("NODE_ENV") === "production",
      meta: {
        traceId,
        endpoint: req.url
      }
    });

    try {
      /**
       * Perform http validation
       */
      if (validation.http) {
        if (!validation.http.allowedMethods.includes(req.method)) {
          res.setHeader("Allow", validation.http.allowedMethods.join(", "));
          throw new errors_src/* HttpError */.oo(405, `${req.method} is not allowed`);
        }
      }
      /**
       * Perform request validation
       */


      const parsedRequest = await validation.request.parseAsync(req).catch(err => {
        throw new errors_src/* HttpError */.oo(400, err.message);
      });
      const backgroundContext = {
        trace: {
          id: traceId
        },
        logger
      };
      /**
       * Run the actual webhook logic
       */

      await webhook({
        backgroundContext,
        req: parsedRequest,
        res
      });
      /**
       * Handle errors gracefully
       */
    } catch (err) {
      logger.error(err);
      res.status(err instanceof errors_src/* HttpError */.oo ? err.statusCode : 500);
      res.json({
        error: "Something went wrong",
        traceId
      });
    } finally {
      await logger.flush();
      res.end();
    }
  };
}
;// CONCATENATED MODULE: ../../libs/http/src/index.ts



/***/ }),

/***/ 347:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": function() { return /* binding */ ECI_TRACE_HEADER; }
/* harmony export */ });
/**
 * The header name where we read and write the traceid
 */
const ECI_TRACE_HEADER = "eci-trace-id";

/***/ }),

/***/ 928:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "fs": function() { return /* reexport */ ContextMissingFieldError; },
  "pY": function() { return /* reexport */ base_GenericError; },
  "oo": function() { return /* reexport */ HttpError; }
});

// UNUSED EXPORTS: EnvironmentVariableNotFoundError

;// CONCATENATED MODULE: ../../libs/util/errors/src/lib/base.ts
class base_GenericError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }

}
;// CONCATENATED MODULE: ../../libs/util/errors/src/lib/env.ts

class EnvironmentVariableNotFoundError extends (/* unused pure expression or super */ null && (GenericError)) {
  /**
   * @param name - The name of the environment variable
   */
  constructor(name) {
    super("EnvironmentNotFoundError", `Environment variable "${name}" not found.`);
  }

}
;// CONCATENATED MODULE: ../../libs/util/errors/src/lib/http.ts
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/**
 * HttpError is used to pass a status code inside nextjs api routes.
 */

class HttpError extends base_GenericError {
  constructor(statusCode, message = "HttpError") {
    super("HttpError", message);

    _defineProperty(this, "statusCode", void 0);

    this.statusCode = statusCode;
  }

}
;// CONCATENATED MODULE: ../../libs/util/errors/src/lib/context.ts

class ContextMissingFieldError extends base_GenericError {
  /**
   * @param missingField - The name field that was not set up properly before.
   */
  constructor(missingField) {
    super("ContextMissingFieldError", `The context is missing a required field: ${missingField}. Is the context set up in the correct order?`);
  }

}
;// CONCATENATED MODULE: ../../libs/util/errors/src/index.ts





/***/ }),

/***/ 44:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "U": function() { return /* reexport */ idGenerator; }
});

// EXTERNAL MODULE: external "@chronark/prefixed-id"
var prefixed_id_ = __webpack_require__(110);
;// CONCATENATED MODULE: ../../libs/util/ids/src/lib/idGenerator.ts

const prefixes = {
  trace: "tr",
  secretKey: "sk",
  publicKey: "pk",

  /**
   * Only used in automatic tests
   */
  "test": "test"
};
const idGenerator = new prefixed_id_.IdGenerator(prefixes);
;// CONCATENATED MODULE: ../../libs/util/ids/src/index.ts


/***/ })

};
;