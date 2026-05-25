import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const putUser = (user) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.putUser,
    method: "PUT",
    accessToken,
    data: user,
  };

  return invokeApi(param);
};

export const putPassword = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.putPassword,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const resendRequest = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.resendRequest,
    method: "POST",
    accessToken,
  };

  return invokeApi(param);
};

export const getPreference = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getPreference,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const putPreference = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.putPreference,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getProfile = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.profile,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const putProfile = (profile) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.profile,
    method: "PUT",
    accessToken,
    data: profile,
  };

  return invokeApi(param);
};
