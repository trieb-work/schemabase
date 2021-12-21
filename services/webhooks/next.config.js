const withTM = require("next-transpile-modules")([
  "@chronark/env",
  "@eci/constants",
  "@eci/errors",
  "@eci/events",
  "@eci/http",
  "@eci/ids",
  "@eci/integration-saleor-product-data-feed",
  "@eci/integration-zoho-logistics",
  "@eci/logger",
  "@eci/saleor",
  "@eci/webhook-context",
]); // pass the modules you would like to see transpiled
module.exports = withTM({});
