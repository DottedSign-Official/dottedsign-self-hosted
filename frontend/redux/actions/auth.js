import * as types from "../../constants/authTypes";

export const setUser = (user) => {
  return { type: types.SET_USER, payload: { user } };
};
export const clearUser = () => {
  return { type: types.CLEAR_USER };
};
export const setGroup = (org) => {
  return { type: types.SET_GROUP, payload: { org } };
};

export const putUser = (user) => {
  return { type: types.PUT_USER, user };
};

export const putUserLanguage = (user) => {
  return { type: types.PUT_USER_LANGUAGE, user };
};

export const putPassword = (passwords) => {
  return { type: types.PUT_PASSWORD, passwords };
};

export const putPreference = (data) => {
  return { type: types.PUT_PREFERENCE, data };
};

export const getProfile = () => {
  return { type: types.GET_PROFILE };
};

export const putProfile = (profile) => {
  return { type: types.PUT_PROFILE, profile };
};

export const resendRequest = () => {
  return { type: types.RESEND_REQUEST };
};

export const setFeatureEnable = (features) => {
  return { type: types.SET_FEATURE_ENABLE, payload: features };
};

export const setFrontDeskIni = () => {
  return { type: types.SET_FRONT_DESK_INI };
};

export const clearFrontDesk = () => {
  return { type: types.CLEAR_FRONT_DESK };
};

export const setPublicFormIni = () => {
  return { type: types.SET_PUBLIC_FORM_INI };
};

export const clearPublicForm = () => {
  return { type: types.CLEAR_PUBLIC_FORM };
};
