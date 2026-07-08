import * as types from "../../constants/memberTypes";

export const getContacts = () => {
  return { type: types.GET_CONTACTS };
};

export const delContact = (data) => {
  return { type: types.DEL_CONTACT, payload: data };
};
