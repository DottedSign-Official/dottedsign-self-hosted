import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";
import { withCSRFToken } from "../helpers/csrf/client";

export const login = (data) => {
  const options = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(data),
  };
  return fetch("/login", withCSRFToken(options))
    .then((res) => res.json())
    .then((resp) => {
      return resp;
    })
    .catch((error) => ({ error: true, message: error.message }));
};

export const register = (data) => {
  const options = {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(data),
  };
  return fetch("/register", withCSRFToken(options))
    .then((res) => res.json())
    .then((resp) => {
      return resp;
    })
    .catch((error) => ({ error: true, message: error.message }));
};

export const forgetPwd = (data) => {
  const param = {
    app: "rabbit",
    path: PATH.forgetPwd,
    method: "POST",
    data,
  };

  return invokeApi(param);
};

export const resetPwd = (data) => {
  const param = {
    app: "rabbit",
    path: PATH.resetPwd,
    method: "PUT",
    data,
  };

  return invokeApi(param);
};
