import * as types from "../../constants/labelTypes";

export const getLabels = (data) => {
  return { type: types.GET_LABELS, payload: data };
};

export const createLabel = (data) => {
  return { type: types.CREATE_LABEL, payload: data };
};

export const putLabel = (data) => {
  return { type: types.PUT_LABEL, payload: data };
};

export const delLabel = (data) => {
  return { type: types.DEL_LABEL, payload: data };
};

export const resetLabels = () => {
  return { type: types.RESET_LABELS };
};

export const setLabelFocus = (data) => {
  return { type: types.SET_LABEL_FOCUS, payload: data };
};

export const manageLabel = (data) => {
  return { type: types.MANAGE_LABEL, payload: data };
};
