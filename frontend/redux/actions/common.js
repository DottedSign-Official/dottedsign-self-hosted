import * as types from "../../constants/commonTypes";

export const openToast = (data) => {
  return { type: types.OPEN_TOAST, ...data };
};

export const closeToast = () => {
  return { type: types.CLOSE_TOAST };
};

export const openModal = (payload) => {
  return { type: types.OPEN_MODAL, payload };
};

export const submitModal = (payload) => {
  return { type: types.SUBMIT_MODAL, payload };
};

export const closeModal = () => {
  return { type: types.CLOSE_MODAL };
};

export const getCountries = () => {
  return { type: types.GET_COUNTRIES };
};

export const clearCoverType = () => {
  return { type: types.CLEAR_COVER };
};
