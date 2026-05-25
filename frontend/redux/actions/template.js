import * as types from "../../constants/templateTypes";

export const getTemplatesAll = (data) => {
  return { type: types.GET_TEMPLATES_ALL, payload: data };
};

export const delTemplate = (data) => {
  return { type: types.DEL_TEMPLATE, payload: data };
};

export const putTemplate = (data) => {
  return { type: types.PUT_TEMPLATE_SETTINGS, payload: data };
};

export const setLabel = (data) => {
  return { type: types.SET_LABEL, payload: data };
};

export const setPage = (data) => {
  return { type: types.SET_PAGE, payload: data };
};

export const setSearchContent = (data) => {
  return { type: types.SET_SEARCH_CONTENT, payload: data };
};

export const setSearchItem = (data) => {
  return { type: types.SET_SEARCH_ITEM, payload: data };
};

export const setTemplate = (data) => {
  return { type: types.SET_TEMPLATE, payload: data };
};

export const getTemplateShareInfo = (data) => {
  return { type: types.GET_TEMPLATE_SHARE_INFO, payload: data };
};

export const delTemplateShareInfo = () => {
  return { type: types.DEL_TEMPLATE_SHARE_INFO };
};

export const putTemplateShare = (data) => {
  return { type: types.PUT_TEMPLATE_SHARE, payload: data };
};

export const getTemplateShareList = (data) => {
  return { type: types.GET_TEMPLATE_SHARE_LIST, payload: data };
};

export const putTemplateAdminShare = (data) => {
  return { type: types.PUT_TEMPLATE_ADMIN_SHARE, payload: data };
};

export const deleteTemplateAdminShare = (data) => {
  return { type: types.DELETE_TEMPLATE_ADMIN_SHARE, payload: data };
};

export const duplicateTemplate = (data) => {
  return { type: types.DUPLICATE_TEMPLATE, payload: data };
};
