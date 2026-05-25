import React from "react";
import { i18n } from "next-i18next";
import { getCspNonce, getCsp } from "../helpers/csp";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = getCspNonce();
    const sheet = new ServerStyleSheet();
    const page = ctx.renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    const currentLanguage = (i18n && i18n.language) || ctx.req.language;

    const style =
      (styleTags &&
        React.Children.map(styleTags, (child) =>
          React.cloneElement(child, {
            nonce,
          }),
        )) ||
      null;

    return {
      ...page,
      ...initialProps,
      currentLanguage,
      styles: (
        <>
          {initialProps.styles}
          {style}
        </>
      ),
      nonce,
    };
  };

  render() {
    return (
      <Html lang={this.props.currentLanguage}>
        <Head>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />

          {this.props.styleTags}
          <meta property="csp-nonce" content={this.props.nonce} />
          <meta
            httpEquiv="Content-Security-Policy"
            content={getCsp(this.props.nonce)}
          />
          <script
            nonce={this.props.nonce}
            dangerouslySetInnerHTML={{
              __html: `window.__webpack_nonce__ = "${this.props.nonce}"`,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @font-face {
              font-family: "Noto Sans TC";
              font-display: swap;
              src: url("/static/font/NotoSansTC-Regular.otf");
            }

            @font-face {
              font-family: "Noto Sans";
              font-display: swap;
              src: url("/static/font/NotoSans-Regular.ttf");
            }

            @font-face {
              font-family: "Clear Sans";
              font-display: swap;
              src: url("/static/font/ClearSans-Regular.ttf");
            }

            @font-face {
              font-family: "Droid Sans";
              font-display: swap;
              src: url("/static/font/DroidSans.ttf");
            }

            @font-face {
              font-family: 'CustomFont';
              font-display: swap;
              src: url('/static/font/CustomFont.ttf') format('truetype');
              unicode-range: U+E000-E005;
            }

            body:lang(en) {
              font-family: 'Clear Sans', sans-serif;
            }
            body:lang(zh-tw) {
              font-family: 'CustomFont', 'Droid Sans', sans-serif;
            }
          `,
            }}
          />
        </Head>
        <body>
          <noscript>
            You are offline, or Javascript has been blocked in your browser.
          </noscript>
          <Main />
          <NextScript nonce={this.props.nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
