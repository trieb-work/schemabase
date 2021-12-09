module.exports = {
  displayName: "queue-manager",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/queue-manager",
};
