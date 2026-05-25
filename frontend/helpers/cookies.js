import Cookie from "js-cookie";

export const setTokenCookies = (accessToken, refreshToken, expires) => {
  if (!expires) {
    return;
  }
  Cookie.set("access_token", accessToken, {
    expires: new Date(Date.now() + expires * 1000),
  });
  Cookie.set("refresh_token", refreshToken, {
    expires: new Date(Date.now() + expires * 20 * 1000),
  });
};

const REFRESH_PATH = "refresh_path";
export const setRefreshPath = (path, options) => {
  if (!path) {
    return;
  }
  Cookie.set(REFRESH_PATH, path, options);
};
export const getRefreshPath = () => Cookie.get(REFRESH_PATH);
export const removeRefreshPath = () => Cookie.remove(REFRESH_PATH);
