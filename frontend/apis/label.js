import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const getLabels = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.label,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const createLabel = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.label,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putLabel = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.label}/modify`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const delLabel = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.label}/remove`,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const manageLabel = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.label}/manage`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};
