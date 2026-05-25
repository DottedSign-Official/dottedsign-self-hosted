import * as types from "../../constants/settingsTypes";

export const getBulks = (data) => {
  return { type: types.GET_BULKS, data };
};
export const getSigningGroup = (data) => {
  return { type: types.GET_SIGNING_GROUP, data };
};
export const setSigningGroupCurrentPage = (data) => {
  return { type: types.SET_SIGNING_GROUP_CURRENT_PAGE, payload: data };
};
export const postSigningGroup = (data) => {
  return { type: types.POST_SIGNING_GROUP, data };
};
export const putSigningGroup = (data) => {
  return { type: types.PUT_SIGNING_GROUP, data };
};
export const delSigningGroup = (data) => {
  return { type: types.DEL_SIGNING_GROUP, data };
};
export const postShareSigningGroup = (data) => {
  return { type: types.POST_SHARE_SIGNING_GROUP, data };
};
