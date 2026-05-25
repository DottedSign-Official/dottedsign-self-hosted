import React from "react";
import { useTranslation } from "next-i18next";
import NextHead from "next/head";
import dataset from "../global/meta";

const Head = ({ page }) => {
  const { t } = useTranslation("meta");
  let myTitle, desc, url;

  let tag;

  if (!page) {
    tag = "landing";
  } else {
    tag = page;

    if (!dataset[tag]) {
      tag = "landing";
    }
  }

  myTitle = t(dataset[tag].myTitle);
  desc = t(dataset[tag].desc);
  url = dataset[tag].url;

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <title>{myTitle}</title>
      <meta name="description" content={desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#586af2" />
      <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />

      <meta property="og:url" content={url} />
      <meta property="og:title" content={myTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="fb:app_id" content="463617073758547" />

      <meta name="twitter:site" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="baidu-site-verification" content="4Wwj3ztrJv" />
    </NextHead>
  );
};

export default Head;
