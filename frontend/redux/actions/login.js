import * as types from "../../constants/loginTypes";

export const setMode = (data) => {
  return { type: types.SET_MODE, data };
};

export const login = (payload) => {
  return { type: types.LOGIN, payload };
};

export const register = (payload) => {
  return { type: types.REGSITER, payload };
};

export const forgetPwd = (data) => {
  return { type: types.FORGET_PWD, data };
};

export const resetPwd = (payload) => {
  return { type: types.RESET_PWD, payload };
};
