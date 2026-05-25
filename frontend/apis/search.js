import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const getTasksSearch = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: PATH.getSearch,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const getTasksSearchDeveloper = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: PATH.getSearchDeveloper,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const getSearchTaskId = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: PATH.getSearchTaskId,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};
