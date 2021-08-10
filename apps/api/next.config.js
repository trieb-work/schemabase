// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require("@nrwl/next/plugins/with-nx")

module.exports = withNx({
  webpack: (config, { isServer }) => {
    //  Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
        child_process: "empty",
      }

      // config.resolve.fallback.fs = false
    }

    return config
  },
})
