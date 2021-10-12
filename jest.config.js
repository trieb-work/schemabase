const { getJestProjects } = require("@nrwl/jest");

module.exports = {
  projects: getJestProjects(),
  testTimeout: 60000,
  injectGlobals: false,
};
