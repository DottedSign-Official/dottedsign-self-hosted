import Cookies from "js-cookie";
import PATH from "../constants/apiPath";
import { invokeApi } from "../helpers/apiHelper";
import { timeoutPromise } from "../helpers/others";

export const getAppRating = (appId) => {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  };

  return fetch(`https://itunes.apple.com/lookup?id=${appId}`, options)
    .then((res) => res.json())
    .then((res) => res)
    .catch((error) => console.warn(error));
};

export const getIp = async (count = 1) => {
  const myIp = Cookies.get("client_ip");
  const myCountry = Cookies.get("client_country");

  if (
    myIp &&
    myIp !== "" &&
    typeof myIp !== "undefined" &&
    myCountry &&
    myCountry !== "" &&
    typeof myCountry !== "undefined"
  ) {
    return;
  }

  const resp = await timeoutPromise(
    5000,
    fetch("https://get.geojs.io/v1/ip/country.json"),
  );

  const { data } = resp;
  if (data && data.ip) {
    const ip = data.ip;
    const code = data.country;
    Cookies.set("client_ip", ip, { expires: 1 });
    Cookies.set("client_country", code, { expires: 1 });
    return;
  } else if (count < 4) {
    // NOTE: timeout, retrieve
    await getIp(count + 1);
    return;
  }
};

export const getFileBlob = (url) => {
  return fetch(url)
    .then((res) => res.blob())
    .then((res) => res)
    .catch((err) => console.log(err));
};

export const getCountries = () => {
  return {
    data: [
      {
        name: "Taiwan",
        alpha2: "TW",
        alpha3: "TWN",
        calling_code: "886",
        emoji: "🇹🇼",
      },
    ],
  };
};

export const postSheet = (data) => {
  const accessTokenCookie = Cookies.get("access_token");

  const param = {
    app: "common",
    path: PATH.postSheet,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const convertImagesToVideo = (data) => {
  const accessTokenCookie = Cookies.get("access_token");

  const param = {
    path: PATH.convertImagesToVideo,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const shortenLink = (data) => {
  const accessTokenCookie = Cookies.get("access_token");

  const param = {
    path: PATH.shortenLink,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export default getAppRating;
