(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/worker/src/main.ts":
/*!*********************************!*\
  !*** ./apps/worker/src/main.ts ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _eci_events_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @eci/events/client */ "./libs/events/client/src/index.ts");
/* harmony import */ var _eci_util_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @eci/util/logger */ "./libs/util/logger/src/index.ts");
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./service */ "./apps/worker/src/service.ts");
/* harmony import */ var _eci_events_strapi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @eci/events/strapi */ "./libs/events/strapi/src/index.ts");
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @chronark/env */ "@chronark/env");
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_chronark_env__WEBPACK_IMPORTED_MODULE_5__);






const logger = new _eci_util_logger__WEBPACK_IMPORTED_MODULE_2__["Logger"]({
    meta: {
        traceId: "",
    },
    enableElastic: false,
});
const signer = new _eci_events_client__WEBPACK_IMPORTED_MODULE_1__["Signer"]({ signingKey: _chronark_env__WEBPACK_IMPORTED_MODULE_5__["env"].require("SIGNING_KEY") });
const strapiConsumer = new _eci_events_strapi__WEBPACK_IMPORTED_MODULE_4__["Consumer"]({
    signer,
    logger,
    connection: {
        host: _chronark_env__WEBPACK_IMPORTED_MODULE_5__["env"].require("REDIS_HOST"),
        port: _chronark_env__WEBPACK_IMPORTED_MODULE_5__["env"].require("REDIS_PORT"),
    },
});
const worker = new _service__WEBPACK_IMPORTED_MODULE_3__["Worker"]({
    logger,
    sources: {
        strapi: {
            consumer: strapiConsumer,
            handlers: [
                {
                    topic: _eci_events_strapi__WEBPACK_IMPORTED_MODULE_4__["Topic"].ENTRY_CREATE,
                    handler: (message) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(void 0, void 0, void 0, function* () {
                        console.log(message);
                    }),
                },
            ],
        },
    },
});
worker.start();


/***/ }),

/***/ "./apps/worker/src/service.ts":
/*!************************************!*\
  !*** ./apps/worker/src/service.ts ***!
  \************************************/
/*! exports provided: Worker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Worker", function() { return Worker; });
class Worker {
    constructor(config) {
        this.logger = config.logger;
        this.sources = config.sources;
    }
    start() {
        this.logger.info("Worker starting");
        for (const [name, source] of Object.entries(this.sources)) {
            for (const { topic, handler } of source.handlers) {
                source.consumer.consume(topic, handler);
                this.logger.info(`${name}: Started listening for ${topic} events`);
            }
        }
    }
}


/***/ }),

/***/ "./libs/events/client/src/index.ts":
/*!*****************************************!*\
  !*** ./libs/events/client/src/index.ts ***!
  \*****************************************/
/*! exports provided: Signer, QueueManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_signature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/signature */ "./libs/events/client/src/lib/signature.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Signer", function() { return _lib_signature__WEBPACK_IMPORTED_MODULE_0__["Signer"]; });

/* harmony import */ var _lib_queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/queue */ "./libs/events/client/src/lib/queue.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QueueManager", function() { return _lib_queue__WEBPACK_IMPORTED_MODULE_1__["QueueManager"]; });

/* harmony import */ var _lib_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/message */ "./libs/events/client/src/lib/message.ts");
/* empty/unused harmony star reexport */




/***/ }),

/***/ "./libs/events/client/src/lib/errors.ts":
/*!**********************************************!*\
  !*** ./libs/events/client/src/lib/errors.ts ***!
  \**********************************************/
/*! exports provided: SignatureError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignatureError", function() { return SignatureError; });
/* harmony import */ var _eci_util_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @eci/util/errors */ "./libs/util/errors/src/index.ts");

class SignatureError extends _eci_util_errors__WEBPACK_IMPORTED_MODULE_0__["GenericError"] {
    constructor() {
        super("SignatureError", "Signature is invalid");
    }
}


/***/ }),

/***/ "./libs/events/client/src/lib/message.ts":
/*!***********************************************!*\
  !*** ./libs/events/client/src/lib/message.ts ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./libs/events/client/src/lib/queue.ts":
/*!*********************************************!*\
  !*** ./libs/events/client/src/lib/queue.ts ***!
  \*********************************************/
/*! exports provided: QueueManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueueManager", function() { return QueueManager; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @chronark/env */ "@chronark/env");
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chronark_env__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bullmq__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bullmq */ "bullmq");
/* harmony import */ var bullmq__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bullmq__WEBPACK_IMPORTED_MODULE_2__);



/**
 * TTopic: strings that can be topics
 */
class QueueManager {
    constructor({ name, signer, logger, connection }) {
        this.logger = logger;
        this.prefix = name;
        this.connection = {
            host: connection.host,
            port: parseInt(connection.port, 10),
            password: connection.password,
        };
        this.workers = {};
        this.queues = {};
        this.signer = signer;
    }
    queueId(topic) {
        return ["eci", _chronark_env__WEBPACK_IMPORTED_MODULE_1__["env"].get("NODE_ENV", "development"), this.prefix, topic]
            .join(":")
            .toLowerCase();
    }
    close() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            yield Promise.all([...Object.values(this.queues), ...Object.values(this.workers)].map((q) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                yield q.close();
                yield q.disconnect();
            })));
        });
    }
    consume(topic, receiver) {
        const id = this.queueId(topic);
        this.logger.info("Creating topic consumer", { topic: id });
        /**
         * Adding multiple workers to a single topic is probably a mistake
         * and can yield unexpected results.
         */
        if (topic in this.workers) {
            throw new Error(`A worker has already been assigned to handle ${topic} messages`);
        }
        this.workers[topic] = new bullmq__WEBPACK_IMPORTED_MODULE_2__["Worker"](id, this.wrapReceiver(receiver), {
            connection: this.connection,
            sharedConnection: true,
        });
        /**
         * This logging might be overkill. We'll see
         */
        this.workers[topic].on("error", (job, reason) => {
            this.logger.error("Job failed", { job, reason });
        });
        this.workers[topic].on("failed", (job, reason) => {
            this.logger.error("Job failed", { job, reason });
        });
    }
    wrapReceiver(handler) {
        return ({ data }) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                this.logger.info("Received message", { message: data });
                this.signer.verify(Object.assign(Object.assign({}, data), { signature: undefined }), data.signature);
                yield handler(data);
                this.logger.info("Processed message", { message: data });
            }
            catch (err) {
                this.logger.error("Error processing message", {
                    message: data,
                    error: err.message,
                });
            }
        });
    }
    /**
     * Send a message to the queue
     * a new traceId is generated if not provided
     */
    produce(topic, message) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const signedMessage = Object.assign(Object.assign({}, message), { signature: this.signer.sign(message) });
            /**
             * Create a new queue for this topic if necessary
             */
            if (!(topic in this.queues)) {
                const id = this.queueId(topic);
                this.logger.debug(`Creating new queue ${id}`);
                this.queues[topic] = new bullmq__WEBPACK_IMPORTED_MODULE_2__["Queue"](id, {
                    connection: this.connection,
                    sharedConnection: true,
                });
            }
            this.logger.debug("pushing message", { signedMessage });
            yield this.queues[topic].add(topic, signedMessage, {
                // Keep only 1000 the last completed jobs in memory,
                removeOnComplete: 1000,
            });
            this.logger.debug("Pushed message", { signedMessage });
        });
    }
}


/***/ }),

/***/ "./libs/events/client/src/lib/signature.ts":
/*!*************************************************!*\
  !*** ./libs/events/client/src/lib/signature.ts ***!
  \*************************************************/
/*! exports provided: Signer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Signer", function() { return Signer; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./libs/events/client/src/lib/errors.ts");


/**
 * Sign and verify json objects
 */
class Signer {
    constructor({ signingKey }) {
        this.signingKey = signingKey;
    }
    /**
     * Create a signature for the given data.
     * @param data - object to be signed
     * @returns
     */
    sign(data) {
        return Object(crypto__WEBPACK_IMPORTED_MODULE_0__["createHmac"])("sha256", this.signingKey)
            .update(JSON.stringify(data))
            .digest("hex");
    }
    /**
     * Verify the data was signed by the given signature.
     */
    verify(data, expectedSignature) {
        const signature = this.sign(data);
        if (signature !== expectedSignature) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__["SignatureError"]();
        }
    }
}


/***/ }),

/***/ "./libs/events/strapi/src/index.ts":
/*!*****************************************!*\
  !*** ./libs/events/strapi/src/index.ts ***!
  \*****************************************/
/*! exports provided: Producer, Consumer, Topic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_producer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/producer */ "./libs/events/strapi/src/lib/producer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Producer", function() { return _lib_producer__WEBPACK_IMPORTED_MODULE_0__["Producer"]; });

/* harmony import */ var _lib_consumer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/consumer */ "./libs/events/strapi/src/lib/consumer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Consumer", function() { return _lib_consumer__WEBPACK_IMPORTED_MODULE_1__["Consumer"]; });

/* harmony import */ var _lib_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/types */ "./libs/events/strapi/src/lib/types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Topic", function() { return _lib_types__WEBPACK_IMPORTED_MODULE_2__["Topic"]; });






/***/ }),

/***/ "./libs/events/strapi/src/lib/consumer.ts":
/*!************************************************!*\
  !*** ./libs/events/strapi/src/lib/consumer.ts ***!
  \************************************************/
/*! exports provided: Consumer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Consumer", function() { return Consumer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _eci_events_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @eci/events/client */ "./libs/events/client/src/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./libs/events/strapi/src/lib/types.ts");



class Consumer {
    constructor(config) {
        this.queueManager = new _eci_events_client__WEBPACK_IMPORTED_MODULE_1__["QueueManager"](Object.assign(Object.assign({}, config), { name: "strapi" }));
    }
    close() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return yield this.queueManager.close();
        });
    }
    consume(topic, process) {
        switch (topic) {
            case _types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_CREATE:
                return this.onEntryCreateEvent(process);
            case _types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_UPDATE:
                return this.onEntryUpdateEvent(process);
            case _types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_DELETE:
                return this.onEntryDeleteEvent(process);
        }
    }
    onEntryCreateEvent(process) {
        this.queueManager.consume(_types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_CREATE, (message) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () { return yield process(message); }));
    }
    onEntryUpdateEvent(process) {
        this.queueManager.consume(_types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_UPDATE, (message) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () { return yield process(message); }));
    }
    onEntryDeleteEvent(process) {
        this.queueManager.consume(_types__WEBPACK_IMPORTED_MODULE_2__["Topic"].ENTRY_DELETE, (message) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () { return yield process(message); }));
    }
}


/***/ }),

/***/ "./libs/events/strapi/src/lib/producer.ts":
/*!************************************************!*\
  !*** ./libs/events/strapi/src/lib/producer.ts ***!
  \************************************************/
/*! exports provided: Producer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Producer", function() { return Producer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _validation_entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validation/entry */ "./libs/events/strapi/src/lib/validation/entry.ts");
/* harmony import */ var _eci_events_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @eci/events/client */ "./libs/events/client/src/index.ts");



class Producer {
    constructor(config) {
        this.queueManager = new _eci_events_client__WEBPACK_IMPORTED_MODULE_2__["QueueManager"](Object.assign(Object.assign({}, config), { name: "strapi" }));
    }
    /**
     * Create a new message and add it to the queue.
     */
    produce(topic, message) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            _validation_entry__WEBPACK_IMPORTED_MODULE_1__["validation"][topic].parseAsync(message.payload).catch((err) => {
                throw new Error(`Trying to push malformed event: ${message}, ${err}`);
            });
            yield this.queueManager.produce(topic, message);
        });
    }
}


/***/ }),

/***/ "./libs/events/strapi/src/lib/types.ts":
/*!*********************************************!*\
  !*** ./libs/events/strapi/src/lib/types.ts ***!
  \*********************************************/
/*! exports provided: Topic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Topic", function() { return Topic; });
var Topic;
(function (Topic) {
    Topic["ENTRY_CREATE"] = "entry.create";
    Topic["ENTRY_UPDATE"] = "entry.update";
    Topic["ENTRY_DELETE"] = "entry.delete";
})(Topic || (Topic = {}));


/***/ }),

/***/ "./libs/events/strapi/src/lib/validation/entry.ts":
/*!********************************************************!*\
  !*** ./libs/events/strapi/src/lib/validation/entry.ts ***!
  \********************************************************/
/*! exports provided: validation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validation", function() { return validation; });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ "zod");
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zod__WEBPACK_IMPORTED_MODULE_0__);

const entryValidation = zod__WEBPACK_IMPORTED_MODULE_0__["z"].object({
    created_at: zod__WEBPACK_IMPORTED_MODULE_0__["z"].string(),
    model: zod__WEBPACK_IMPORTED_MODULE_0__["z"].string(),
    entry: zod__WEBPACK_IMPORTED_MODULE_0__["z"].object({
        id: zod__WEBPACK_IMPORTED_MODULE_0__["z"].number().int(),
        created_at: zod__WEBPACK_IMPORTED_MODULE_0__["z"].string(),
        updated_at: zod__WEBPACK_IMPORTED_MODULE_0__["z"].string(),
    }),
});
const validation = {
    "entry.create": zod__WEBPACK_IMPORTED_MODULE_0__["z"]
        .object({
        event: zod__WEBPACK_IMPORTED_MODULE_0__["z"].enum(["entry.create"]),
    })
        .merge(entryValidation),
    "entry.update": zod__WEBPACK_IMPORTED_MODULE_0__["z"]
        .object({
        event: zod__WEBPACK_IMPORTED_MODULE_0__["z"].enum(["entry.update"]),
    })
        .merge(entryValidation),
    "entry.delete": zod__WEBPACK_IMPORTED_MODULE_0__["z"]
        .object({
        event: zod__WEBPACK_IMPORTED_MODULE_0__["z"].enum(["entry.delete"]),
    })
        .merge(entryValidation),
};


/***/ }),

/***/ "./libs/util/errors/src/index.ts":
/*!***************************************!*\
  !*** ./libs/util/errors/src/index.ts ***!
  \***************************************/
/*! exports provided: EnvironmentVariableNotFoundError, HttpError, ContextMissingFieldError, GenericError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/env */ "./libs/util/errors/src/lib/env.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EnvironmentVariableNotFoundError", function() { return _lib_env__WEBPACK_IMPORTED_MODULE_0__["EnvironmentVariableNotFoundError"]; });

/* harmony import */ var _lib_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/http */ "./libs/util/errors/src/lib/http.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpError", function() { return _lib_http__WEBPACK_IMPORTED_MODULE_1__["HttpError"]; });

/* harmony import */ var _lib_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/context */ "./libs/util/errors/src/lib/context.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ContextMissingFieldError", function() { return _lib_context__WEBPACK_IMPORTED_MODULE_2__["ContextMissingFieldError"]; });

/* harmony import */ var _lib_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/base */ "./libs/util/errors/src/lib/base.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GenericError", function() { return _lib_base__WEBPACK_IMPORTED_MODULE_3__["GenericError"]; });







/***/ }),

/***/ "./libs/util/errors/src/lib/base.ts":
/*!******************************************!*\
  !*** ./libs/util/errors/src/lib/base.ts ***!
  \******************************************/
/*! exports provided: GenericError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericError", function() { return GenericError; });
class GenericError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}


/***/ }),

/***/ "./libs/util/errors/src/lib/context.ts":
/*!*********************************************!*\
  !*** ./libs/util/errors/src/lib/context.ts ***!
  \*********************************************/
/*! exports provided: ContextMissingFieldError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContextMissingFieldError", function() { return ContextMissingFieldError; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./libs/util/errors/src/lib/base.ts");

class ContextMissingFieldError extends _base__WEBPACK_IMPORTED_MODULE_0__["GenericError"] {
    /**
     * @param missingField - The name field that was not set up properly before.
     */
    constructor(missingField) {
        super("ContextMissingFieldError", `The context is missing a required field: ${missingField}. Is the context set up in the correct order?`);
    }
}


/***/ }),

/***/ "./libs/util/errors/src/lib/env.ts":
/*!*****************************************!*\
  !*** ./libs/util/errors/src/lib/env.ts ***!
  \*****************************************/
/*! exports provided: EnvironmentVariableNotFoundError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EnvironmentVariableNotFoundError", function() { return EnvironmentVariableNotFoundError; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./libs/util/errors/src/lib/base.ts");

class EnvironmentVariableNotFoundError extends _base__WEBPACK_IMPORTED_MODULE_0__["GenericError"] {
    /**
     * @param name - The name of the environment variable
     */
    constructor(name) {
        super("EnvironmentNotFoundError", `Environment variable "${name}" not found.`);
    }
}


/***/ }),

/***/ "./libs/util/errors/src/lib/http.ts":
/*!******************************************!*\
  !*** ./libs/util/errors/src/lib/http.ts ***!
  \******************************************/
/*! exports provided: HttpError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpError", function() { return HttpError; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./libs/util/errors/src/lib/base.ts");

/**
 * HttpError is used to pass a status code inside nextjs api routes.
 */
class HttpError extends _base__WEBPACK_IMPORTED_MODULE_0__["GenericError"] {
    constructor(statusCode, message = "HttpError") {
        super("HttpError", message);
        this.statusCode = statusCode;
    }
}


/***/ }),

/***/ "./libs/util/logger/src/index.ts":
/*!***************************************!*\
  !*** ./libs/util/logger/src/index.ts ***!
  \***************************************/
/*! exports provided: Logger, NoopLogger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/logger */ "./libs/util/logger/src/lib/logger.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return _lib_logger__WEBPACK_IMPORTED_MODULE_0__["Logger"]; });

/* harmony import */ var _lib_noop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/noop */ "./libs/util/logger/src/lib/noop.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NoopLogger", function() { return _lib_noop__WEBPACK_IMPORTED_MODULE_1__["NoopLogger"]; });





/***/ }),

/***/ "./libs/util/logger/src/lib/logger.ts":
/*!********************************************!*\
  !*** ./libs/util/logger/src/lib/logger.ts ***!
  \********************************************/
/*! exports provided: Logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! winston */ "winston");
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(winston__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var winston_elasticsearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! winston-elasticsearch */ "winston-elasticsearch");
/* harmony import */ var winston_elasticsearch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(winston_elasticsearch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chronark/env */ "@chronark/env");
/* harmony import */ var _chronark_env__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_chronark_env__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _elastic_ecs_winston_format__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/ecs-winston-format */ "@elastic/ecs-winston-format");
/* harmony import */ var _elastic_ecs_winston_format__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_ecs_winston_format__WEBPACK_IMPORTED_MODULE_4__);





class Logger {
    constructor(config) {
        this.meta = Object.assign(Object.assign({}, config === null || config === void 0 ? void 0 : config.meta), { env: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].get("NODE_ENV"), commit: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].get("VERCEL_GIT_COMMIT_SHA") });
        this.logger = winston__WEBPACK_IMPORTED_MODULE_1___default.a.createLogger({
            transports: [new winston__WEBPACK_IMPORTED_MODULE_1___default.a.transports.Console()],
            format: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].get("NODE_ENV") === "production"
                ? winston__WEBPACK_IMPORTED_MODULE_1___default.a.format.json()
                : winston__WEBPACK_IMPORTED_MODULE_1___default.a.format.prettyPrint({ colorize: true }),
        });
        const isCI = _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].get("CI") === "true";
        if (!isCI && (config === null || config === void 0 ? void 0 : config.enableElastic)) {
            this.debug("Enabling elastic transport");
            // this.apm ??= APMAgent.start({ serviceName: "eci-v2" });
            /**
             * ECS requires a special logging format.
             * This overwrites the prettyprint or json format.
             *
             * @see https://www.elastic.co/guide/en/ecs-logging/nodejs/current/winston.html
             */
            this.logger.format = _elastic_ecs_winston_format__WEBPACK_IMPORTED_MODULE_4___default()({ convertReqRes: true });
            /**
             * Ships all our logs to elasticsearch
             */
            this.elasticSearchTransport = new winston_elasticsearch__WEBPACK_IMPORTED_MODULE_2__["ElasticsearchTransport"]({
                level: "info",
                apm: this.apm,
                dataStream: true,
                clientOpts: {
                    node: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].require("ELASTIC_LOGGING_SERVER"),
                    auth: {
                        username: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].require("ELASTIC_LOGGING_USERNAME"),
                        password: _chronark_env__WEBPACK_IMPORTED_MODULE_3__["env"].require("ELASTIC_LOGGING_PASSWORD"),
                    },
                },
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
        copy.meta = Object.assign(Object.assign({}, this.meta), additionalMeta);
        return copy;
    }
    /**
     * Serialize the message
     *
     * The fields will overwrite the default metadata if keys overlap.
     */
    log(level, message, fields = {}) {
        this.logger.log(level, message, Object.assign(Object.assign({}, this.meta), fields));
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
    flush() {
        var _a, _b;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            yield Promise.all([
                (_a = this.elasticSearchTransport) === null || _a === void 0 ? void 0 : _a.flush(),
                (_b = this.apm) === null || _b === void 0 ? void 0 : _b.flush(),
            ]);
        });
    }
}


/***/ }),

/***/ "./libs/util/logger/src/lib/noop.ts":
/*!******************************************!*\
  !*** ./libs/util/logger/src/lib/noop.ts ***!
  \******************************************/
/*! exports provided: NoopLogger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoopLogger", function() { return NoopLogger; });
class NoopLogger {
    with(_additionalMeta) {
        return new NoopLogger();
    }
    debug(_message, _fields) {
        return;
    }
    info(_message, _fields) {
        return;
    }
    warn(_message, _fields) {
        return;
    }
    error(_message, _fields) {
        return;
    }
    flush() {
        return Promise.resolve();
    }
}


/***/ }),

/***/ 0:
/*!***************************************!*\
  !*** multi ./apps/worker/src/main.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/chronark/github/trieb-work/eci/apps/worker/src/main.ts */"./apps/worker/src/main.ts");


/***/ }),

/***/ "@chronark/env":
/*!********************************!*\
  !*** external "@chronark/env" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@chronark/env");

/***/ }),

/***/ "@elastic/ecs-winston-format":
/*!**********************************************!*\
  !*** external "@elastic/ecs-winston-format" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@elastic/ecs-winston-format");

/***/ }),

/***/ "bullmq":
/*!*************************!*\
  !*** external "bullmq" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bullmq");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),

/***/ "winston-elasticsearch":
/*!****************************************!*\
  !*** external "winston-elasticsearch" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston-elasticsearch");

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zod");

/***/ })

/******/ })));
//# sourceMappingURL=main.js.map