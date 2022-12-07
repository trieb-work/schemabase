module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer) {
      config.resolve.fallback.net = false;
      config.resolve.fallback.fs = false;
    }
    if (nextRuntime === "edge") {
      config.resolve.alias.zlib = require.resolve("browserify-zlib");
      config.resolve.alias.buffer = require.resolve("buffer/");
      config.resolve.fallback.buffer = require.resolve("buffer/");
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/tracking/dpd/v1",
        destination: "/api/v1/tracking/dpd/wh_7ab4ba9b85b44f6fbdfa066e85e9f159",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/graphql",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "*" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};
