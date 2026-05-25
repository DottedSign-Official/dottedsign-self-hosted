import Cookies from "js-cookie";
import { getRefreshPath, removeRefreshPath, setRefreshPath } from "./cookies";

export const getRedirectPath = (cleanup) => {
  const encodedValue = getRefreshPath();

  if (encodedValue) {
    const decodedValue = decodeURIComponent(encodedValue);
    if (cleanup) {
      removeRefreshPath();
    }
    return decodedValue;
  } else {
    return null;
  }
};

export const setRedirectCookie = (router) => {
  let myQs = "";

  if (
    router.query &&
    Object.keys(router.query).length > 0 &&
    !(
      Object.keys(router.query).length === 1 &&
      Object.keys(router.query)[0] === "lng"
    )
  ) {
    Object.keys(router.query).forEach((key, idx) => {
      if (idx === 0) {
        myQs += "?";
      }
      if (key === "lng") {
        return;
      }

      myQs += `${key}=${router.query[key]}`;
      if (idx !== Object.keys(router.query).length - 1) {
        myQs += "&&";
      }
    });
  }
  setRefreshPath(encodeURIComponent(`${router.pathname}${myQs}`), {
    expires: 1,
  });
};

export const onAuth = (data) => {
  if (typeof window === "undefined") {
    return null;
  }

  const { router } = data;

  if (router) {
    setRedirectCookie(router);
  }

  window.location = "/";
};

export const onLogout = () => {
  if (typeof window === "undefined") {
    return null;
  }

  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  window.location = "/";
};
