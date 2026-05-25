module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-tw"],
    localeSubpaths: "foreign",
    lowerCaseLng: true,
    ignoreRoutes: [
      "/_next",
      "/static",
      "/robots.txt",
      "/sitemap.xml",
      "/favicon.ico",
      "/sw",
      "/workbox-",
      "/sw.js",
      "/manifest.json",
    ],
  },
  react: { useSuspense: false },
};
