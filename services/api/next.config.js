module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.net = false;
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/tracking/dpd/v1",
        destination: "/api/v1/tracking/dpd/wh_dd171ebc5a1d778ec3574f2333708fcd",
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
