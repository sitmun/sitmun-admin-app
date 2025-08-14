/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "d3": "<rootDir>/node_modules/d3/dist/d3.min.js",
    "^@app/domain$": "<rootDir>/src/app/domain",
    "^@app/domain/(.*)$": "<rootDir>/src/app/domain/$1",
    "^@app/material-module$": "<rootDir>/src/app/material-module",
    "^@app/frontend-gui/src/lib/public_api$": "<rootDir>/src/app/frontend-gui/src/lib/public_api",
    "^@app/core/config/external-configuration.service$": "<rootDir>/src/app/core/config/external-configuration.service",
    "^@app/core/hal/resource/resource.service$": "<rootDir>/src/app/core/hal/resource/resource.service",
    "^@app/core/hal/config/external.service$": "<rootDir>/src/app/core/hal/config/external.service",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@config$": "<rootDir>/src/config.ts",
    "^@environments/(.*)$": "<rootDir>/src/environments/$1"
  },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFilesAfterEnv: [
    "<rootDir>/setup-jest.ts"
  ],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.mjs$|@angular|rxjs)"
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/*.spec.ts"
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};

export default config;
