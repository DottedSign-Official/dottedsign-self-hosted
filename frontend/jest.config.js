const targetPercentage = 0;
const threshold = {
  statements: targetPercentage,
  branches: targetPercentage,
  functions: targetPercentage,
  lines: targetPercentage,
};

module.exports = {
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "components/**/*.js",
    "containers/**/*.js",
    "helpers/**/*.js",
    "loginComponents/**/*.js",
    "redux/**/*.js",
  ],
  coverageThreshold: {
    global: threshold,
  },
  setupFiles: ["jest-canvas-mock"],
  moduleNameMapper: {
    "^pdfjs-dist$": "<rootDir>/__mocks__/pdfjs-dist.js",
    "^next/router$": "next-router-mock",
  },
};
