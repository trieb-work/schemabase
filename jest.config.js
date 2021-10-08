const { getJestProjects } = require("@nrwl/jest");

module.exports = {
  projects: getJestProjects(),
  testTimeout: 60_000,
  injectGlobals: false,
};
