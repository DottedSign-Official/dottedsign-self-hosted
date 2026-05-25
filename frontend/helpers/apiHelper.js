import Cookie from "js-cookie";
import { setTokenCookies } from "./cookies";
import queryString from "query-string";
import getAPIHost from "./getAPIHost";
import { withCSRFToken } from "../helpers/csrf/client";
import { findNonSnakeCaseKey } from "./validateRequestData";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const isDev = publicRuntimeConfig.NODE_ENV === "dev";

const FETCH_FAILED_ERROR_CODE = 10000;

export const withMiddleware = (invokeApi, requestParser, responseParser) => {
  return (data) => {
    const formattedData = requestParser(data);
    return new Promise((resolve) => {
      invokeApi(formattedData).then((data) => {
        resolve(responseParser(data));
      });
    });
  };
};

export const invokeApi = ({
  app,
  path,
  method,
  accessToken,
  data,
  isServer,
}) => {
  const ip = Cookie.get("client_ip");

  let stringified = "";
  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };

  // NOTE: check if req data is in snake_case
  if (isDev) {
    const invalidKeyPath = findNonSnakeCaseKey(data);
    if (invalidKeyPath) {
      const errorMessage = `Key "${invalidKeyPath}" is not in snake_case`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  const dataManified = Object.assign({}, data, {
    client: "web",
    ip_address: ip || null,
  });

  if (method === "GET") {
    stringified = queryString.stringify(dataManified, {
      arrayFormat: "bracket",
    });
  } else {
    options.body = JSON.stringify(dataManified);
  }

  const host = isServer ? process.env.BACKEND_HOST : getAPIHost();

  return fetch(`${host}${path}?${stringified}`, options)
    .then((res) => res.json())
    .then((resp) => {
      // NOTE: 400003 || 401001 expired
      // NOTE: others: unknown
      if (
        resp.error_code &&
        (resp.error_code === 4000 ||
          resp.error_code === 4001 ||
          resp.error_code === 400002 ||
          resp.error_code === 400003 ||
          resp.error_code === 401001)
      ) {
        if (isServer) {
          return { error_code: resp.error_code || resp.error };
        }

        // NOTE: check refresh_token to prevent token refreshing
        const refresh_token = Cookie.get("refresh_token");
        if (!refresh_token || refresh_token === "undefined") {
          return resp;
        }

        return fetch(
          "/refresh",
          withCSRFToken({
            method: "POST",
            headers: new Headers({
              Accept: "application/json",
              "Content-type": "application/json",
            }),
          }),
        )
          .then((resp) => resp.json())
          .then((resp) => {
            const { access_token, refresh_token, expires_in } = resp;
            if (access_token) {
              setTokenCookies(access_token, refresh_token, expires_in);
              return invokeApi({
                app,
                path,
                method,
                accessToken: access_token,
                data,
              });
            }
          })
          .catch((error) => console.log(error));
      }

      return resp;
    })
    .catch((error) => ({
      error: true,
      error_code: FETCH_FAILED_ERROR_CODE,
      error_message: error.message,
    }));
};

export default invokeApi;
