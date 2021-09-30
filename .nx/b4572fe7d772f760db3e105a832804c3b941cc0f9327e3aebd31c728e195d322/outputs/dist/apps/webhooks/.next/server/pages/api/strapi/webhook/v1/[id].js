(function() {
var exports = {};
exports.id = 323;
exports.ids = [323];
exports.modules = {

/***/ 351:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _id_; }
});

// EXTERNAL MODULE: ../../libs/context/src/index.ts + 5 modules
var src = __webpack_require__(906);
// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(417);
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_);
// EXTERNAL MODULE: external "zod"
var external_zod_ = __webpack_require__(242);
// EXTERNAL MODULE: ../../libs/util/errors/src/index.ts + 4 modules
var errors_src = __webpack_require__(928);
// EXTERNAL MODULE: ../../libs/http/src/index.ts + 4 modules
var http_src = __webpack_require__(881);
;// CONCATENATED MODULE: ../../libs/events/strapi/src/lib/validation/entry.ts

const entryValidation = external_zod_.z.object({
  created_at: external_zod_.z.string(),
  model: external_zod_.z.string(),
  entry: external_zod_.z.object({
    id: external_zod_.z.number().int(),
    created_at: external_zod_.z.string(),
    updated_at: external_zod_.z.string()
  })
});
const validation = {
  "entry.create": external_zod_.z.object({
    event: external_zod_.z.enum(["entry.create"])
  }).merge(entryValidation),
  "entry.update": external_zod_.z.object({
    event: external_zod_.z.enum(["entry.update"])
  }).merge(entryValidation),
  "entry.delete": external_zod_.z.object({
    event: external_zod_.z.enum(["entry.delete"])
  }).merge(entryValidation)
};
;// CONCATENATED MODULE: ../../libs/events/client/src/lib/errors.ts

class SignatureError extends errors_src/* GenericError */.pY {
  constructor() {
    super("SignatureError", "Signature is invalid");
  }

}
;// CONCATENATED MODULE: ../../libs/events/client/src/lib/signature.ts
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Sign and verify json objects
 */
class Signer {
  /**
   * Secret key used to sign the data.
   */
  constructor({
    signingKey
  }) {
    _defineProperty(this, "signingKey", void 0);

    this.signingKey = signingKey;
  }
  /**
   * Create a signature for the given data.
   * @param data - object to be signed
   * @returns
   */


  sign(data) {
    return (0,external_crypto_.createHmac)("sha256", this.signingKey).update(JSON.stringify(data)).digest("hex");
  }
  /**
   * Verify the data was signed by the given signature.
   */


  verify(data, expectedSignature) {
    const signature = this.sign(data);

    if (signature !== expectedSignature) {
      throw new SignatureError();
    }
  }

}
// EXTERNAL MODULE: external "@chronark/env"
var env_ = __webpack_require__(655);
;// CONCATENATED MODULE: external "bullmq"
var external_bullmq_namespaceObject = require("bullmq");;
;// CONCATENATED MODULE: ../../libs/events/client/src/lib/queue.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { queue_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function queue_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * TTopic: strings that can be topics
 */
class queue_QueueManager {
  /**
   * Used to sign and verify messages
   */

  /**
   * The queue prefix.
   * Each topic will be a unique queue with this prefix and topic name.
   */
  constructor({
    name,
    signer,
    logger,
    connection
  }) // consume: (topic: TTopic, message: Message<TPayload>) => Promise<void>,
  {
    queue_defineProperty(this, "signer", void 0);

    queue_defineProperty(this, "logger", void 0);

    queue_defineProperty(this, "prefix", void 0);

    queue_defineProperty(this, "connection", void 0);

    queue_defineProperty(this, "workers", void 0);

    queue_defineProperty(this, "queues", void 0);

    this.logger = logger;
    this.prefix = name;
    this.connection = {
      host: connection.host,
      port: parseInt(connection.port, 10),
      password: connection.password
    };
    this.workers = {};
    this.queues = {};
    this.signer = signer;
  }

  queueId(topic) {
    return ["eci", env_.env.get("NODE_ENV", "development"), this.prefix, topic].join(":").toLowerCase();
  }

  async close() {
    await Promise.all([...Object.values(this.queues), ...Object.values(this.workers)].map(async q => {
      await q.close();
      await q.disconnect();
    }));
  }

  consume(topic, receiver) {
    const id = this.queueId(topic);
    this.logger.info("Creating topic consumer", {
      topic: id
    });
    /**
     * Adding multiple workers to a single topic is probably a mistake
     * and can yield unexpected results.
     */

    if (topic in this.workers) {
      throw new Error(`A worker has already been assigned to handle ${topic} messages`);
    }

    this.workers[topic] = new external_bullmq_namespaceObject.Worker(id, this.wrapReceiver(receiver), {
      connection: this.connection,
      sharedConnection: true
    });
    /**
     * This logging might be overkill. We'll see
     */

    this.workers[topic].on("error", (job, reason) => {
      this.logger.error("Job failed", {
        job,
        reason
      });
    });
    this.workers[topic].on("failed", (job, reason) => {
      this.logger.error("Job failed", {
        job,
        reason
      });
    });
  }

  wrapReceiver(handler) {
    return async ({
      data
    }) => {
      try {
        this.logger.info("Received message", {
          message: data
        });
        this.signer.verify(_objectSpread(_objectSpread({}, data), {}, {
          signature: undefined
        }), data.signature);
        await handler(data);
        this.logger.info("Processed message", {
          message: data
        });
      } catch (err) {
        this.logger.error("Error processing message", {
          message: data,
          error: err.message
        });
      }
    };
  }
  /**
   * Send a message to the queue
   * a new traceId is generated if not provided
   */


  async produce(topic, message) {
    const signedMessage = _objectSpread(_objectSpread({}, message), {}, {
      signature: this.signer.sign(message)
    });
    /**
     * Create a new queue for this topic if necessary
     */


    if (!(topic in this.queues)) {
      const id = this.queueId(topic);
      this.logger.debug(`Creating new queue ${id}`);
      this.queues[topic] = new external_bullmq_namespaceObject.Queue(id, {
        connection: this.connection,
        sharedConnection: true
      });
    }

    this.logger.debug("pushing message", {
      signedMessage
    });
    await this.queues[topic].add(topic, signedMessage, {
      // Keep only 1000 the last completed jobs in memory,
      removeOnComplete: 1000
    });
    this.logger.debug("Pushed message", {
      signedMessage
    });
  }

}
;// CONCATENATED MODULE: ../../libs/events/client/src/index.ts



;// CONCATENATED MODULE: ../../libs/events/strapi/src/lib/producer.ts
function producer_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function producer_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { producer_ownKeys(Object(source), true).forEach(function (key) { producer_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { producer_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function producer_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Producer {
  constructor(config) {
    producer_defineProperty(this, "queueManager", void 0);

    this.queueManager = new queue_QueueManager(producer_objectSpread(producer_objectSpread({}, config), {}, {
      name: "strapi"
    }));
  }
  /**
   * Create a new message and add it to the queue.
   */


  async produce(topic, message) {
    validation[topic].parseAsync(message.payload).catch(err => {
      throw new Error(`Trying to push malformed event: ${message}, ${err}`);
    });
    await this.queueManager.produce(topic, message);
  }

}
;// CONCATENATED MODULE: ../../libs/events/strapi/src/lib/types.ts
let types_Topic;

(function (Topic) {
  Topic["ENTRY_CREATE"] = "entry.create";
  Topic["ENTRY_UPDATE"] = "entry.update";
  Topic["ENTRY_DELETE"] = "entry.delete";
})(types_Topic || (types_Topic = {}));
;// CONCATENATED MODULE: ../../libs/events/strapi/src/lib/consumer.ts
function consumer_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function consumer_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { consumer_ownKeys(Object(source), true).forEach(function (key) { consumer_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { consumer_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function consumer_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Consumer {
  constructor(config) {
    consumer_defineProperty(this, "queueManager", void 0);

    this.queueManager = new QueueManager(consumer_objectSpread(consumer_objectSpread({}, config), {}, {
      name: "strapi"
    }));
  }

  async close() {
    return await this.queueManager.close();
  }

  consume(topic, process) {
    switch (topic) {
      case Topic.ENTRY_CREATE:
        return this.onEntryCreateEvent(process);

      case Topic.ENTRY_UPDATE:
        return this.onEntryUpdateEvent(process);

      case Topic.ENTRY_DELETE:
        return this.onEntryDeleteEvent(process);
    }
  }

  onEntryCreateEvent(process) {
    this.queueManager.consume(Topic.ENTRY_CREATE, async message => await process(message));
  }

  onEntryUpdateEvent(process) {
    this.queueManager.consume(Topic.ENTRY_UPDATE, async message => await process(message));
  }

  onEntryDeleteEvent(process) {
    this.queueManager.consume(Topic.ENTRY_DELETE, async message => await process(message));
  }

}
;// CONCATENATED MODULE: ../../libs/events/strapi/src/index.ts



// EXTERNAL MODULE: ../../libs/util/ids/src/index.ts + 1 modules
var ids_src = __webpack_require__(44);
;// CONCATENATED MODULE: ./pages/api/strapi/webhook/v1/[id]/index.ts









const requestValidation = external_zod_.z.object({
  query: external_zod_.z.object({
    id: external_zod_.z.string()
  }),
  headers: external_zod_.z.object({
    authorization: external_zod_.z.string()
  }),
  body: external_zod_.z.object({
    event: external_zod_.z.enum(["entry.create", "entry.update", "entry.delete"]),
    created_at: external_zod_.z.string(),
    model: external_zod_.z.string(),
    entry: external_zod_.z.object({
      id: external_zod_.z.number().int(),
      created_at: external_zod_.z.string(),
      updated_at: external_zod_.z.string()
    })
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
  var _app$webhooks$find;

  const {
    headers: {
      authorization
    },
    query: {
      id
    }
  } = req;
  const ctx = await (0,src/* extendContext */.sj)(backgroundContext, (0,src/* setupPrisma */.o7)());
  const app = await ctx.prisma.strapiApp.findFirst({
    where: {
      webhooks: {
        some: {
          id
        }
      }
    },
    include: {
      webhooks: {
        include: {
          secret: true
        }
      }
    }
  });

  if (!app) {
    throw new errors_src/* HttpError */.oo(404, `No webhook found: ${id}`);
  }

  if (external_crypto_default().createHash("sha256").update(authorization).digest("hex") !== ((_app$webhooks$find = app.webhooks.find(w => w.id === id)) === null || _app$webhooks$find === void 0 ? void 0 : _app$webhooks$find.secret.secret)) {
    throw new errors_src/* HttpError */.oo(403, "Authorization token invalid");
  }

  ctx.logger.info("Received valid webhook from strapi");
  const queue = new Producer({
    logger: ctx.logger,
    signer: new Signer({
      signingKey: env_.env.require("SIGNING_KEY")
    }),
    connection: {
      host: env_.env.require("REDIS_HOST"),
      port: env_.env.require("REDIS_PORT"),
      password: env_.env.require("REDIS_PASSWORD")
    }
  });
  const message = {
    payload: req.body,
    meta: {
      traceId: ids_src/* idGenerator.id */.U.id("trace")
    }
  };

  switch (req.body.event) {
    case "entry.create":
      await queue.produce(types_Topic.ENTRY_CREATE, message);
      break;

    case "entry.update":
      await queue.produce(types_Topic.ENTRY_UPDATE, message);
      break;

    case "entry.delete":
      await queue.produce(types_Topic.ENTRY_DELETE, message);
      break;

    default:
      break;
  }

  res.json({
    status: "received",
    traceId: ctx.trace.id
  });
};

/* harmony default export */ var _id_ = ((0,http_src/* handleWebhook */.q)({
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

/***/ 417:
/***/ (function(module) {

"use strict";
module.exports = require("crypto");;

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
var __webpack_exports__ = __webpack_require__.X(0, [881,906], function() { return __webpack_exec__(351); });
module.exports = __webpack_exports__;

})();