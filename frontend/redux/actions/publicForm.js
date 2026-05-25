import * as types from "../../constants/publicFormTypes";

export const setIsPublicForm = (payload) => {
  return { type: types.SET_IS_PUBLIC_FORM, payload };
};

export const getPublicFormAll = (data) => {
  return { type: types.GET_PUBLIC_FORM_ALL, data };
};

export const setPublicFormCurrentPage = (page) => {
  return { type: types.SET_PUBLIC_FORM_CURRENT_PAGE, payload: page };
};

export const setPublicFormPerPage = (perPage) => {
  return { type: types.SET_PUBLIC_FORM_PER_PAGE, payload: perPage };
};

export const setPublicFormSearchTerm = (searchTerm) => {
  return { type: types.SET_PUBLIC_FORM_SEARCH_TERM, payload: searchTerm };
};

export const getPublicFormPreview = (data) => {
  return { type: types.GET_PUBLIC_FORM_PREVIEW, data };
};

export const deletePublicForm = (data) => {
  return { type: types.DELETE_PUBLIC_FORM, data };
};

export const getPublicFormCsv = (data) => {
  return { type: types.GET_PUBLIC_FORM_CSV, data };
};

export const putPublicFormStatus = (data) => {
  return { type: types.PUT_PUBLIC_FORM_STATUS, data };
};

export const setTabActive = (data) => {
  return { type: types.SET_TAB_ACTIVE, payload: data };
};

export const putPublicFormCompress = (data) => {
  return { type: types.PUT_PUBLIC_FORM_COMPRESS, data };
};

export const resetPublicForm = () => {
  return { type: types.RESET_PUBLIC_FORM };
};

export const updatePublicFormCondition = (payload) => {
  return { type: types.UPDATE_PUBLIC_FORM_CONDITION, payload };
};
