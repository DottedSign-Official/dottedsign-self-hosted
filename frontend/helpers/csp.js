import { v4 as uuidv4 } from "uuid";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const isDev = publicRuntimeConfig.NODE_ENV === "dev";

export const getCspNonce = () => Buffer.from(uuidv4()).toString("base64");

export const getCsp = (nonce) => {
  const CSP = {
    NONE: `'none'`,
    SELF: `'self'`,
    NONCE: `'nonce-${nonce}'`,
    UNSAFE_INLINE: `'unsafe-inline'`,
    UNSAFE_EVAL: `'unsafe-eval'`,
  };

  const basic = {
    "base-uri": [CSP.SELF],
    "form-action": [CSP.NONE],
    "default-src": [CSP.SELF],
    "script-src": [
      CSP.SELF,
      CSP.NONCE,
      "data:",
      `${isDev ? CSP.UNSAFE_EVAL : CSP.UNSAFE_INLINE}`,
    ],
    "style-src": [CSP.SELF, CSP.UNSAFE_INLINE, "data:", "blob:"],
    "connect-src": [CSP.SELF, "data:", "blob:", "wss:", "ws:"],
    "img-src": [CSP.SELF, "data:", "blob:"],
    "font-src": [CSP.SELF],
    "worker-src": [CSP.SELF, "blob:"],
    "child-src": ["blob:"],
    "script-src-elem": [CSP.SELF, CSP.NONCE],
  };

  const externalResources = {
    "connect-src": [
      "https://get.geojs.io",
      `${isDev ? process.env.NEXT_PUBLIC_API_HOST : ""}`,
    ],
    "img-src": [`${isDev ? process.env.NEXT_PUBLIC_API_HOST : ""}`],
  };

  const cspString = Object.keys({ ...basic, ...externalResources })
    .map((key) => {
      const settings = [key];
      if (basic[key]) {
        settings.push(...basic[key]);
      }
      if (externalResources[key]) {
        settings.push(...externalResources[key]);
      }
      return settings.join(" ");
    })
    .join("; ");

  return cspString;
};
