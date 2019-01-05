module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  testMatch: ["**/src/**/?(*.)+(test).+(js|ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest"
  },
  preset: "ts-jest/presets/js-with-ts"
};
