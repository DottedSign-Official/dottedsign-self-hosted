const withPlugins = require("next-compose-plugins");
const path = require("path");
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  webpack: (config) => {
    // NOTE: Unshift polyfills in main entrypoint.
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (
        entries["main.js"] &&
        !entries["main.js"].includes("./helpers/polyfills.js")
      ) {
        entries["main.js"].unshift("./helpers/polyfills.js");
      }
      return entries;
    };
    return config;
  },
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    ENV: process.env.ENV,
    VERSION: process.env.VERSION,
  },
};

module.exports = nextConfig;
