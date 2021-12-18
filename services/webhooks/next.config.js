const withTM = require("next-transpile-modules")([
  "@eci/errors",
  "@eci/events",
  "@eci/http",
  "@eci/constants",
  "@eci/ids",
  "@eci/logger",
  "@eci/webhook-context",
  "@eci/saleor",
  "@eci/integration-zoho-logistics",
  "@eci/integration-saleor-product-data-feed",
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
});
