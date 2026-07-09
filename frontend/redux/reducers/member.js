import { produce } from "immer";

import {
  GET_CONTACTS,
  GET_CONTACTS_SUC,
  GET_CONTACTS_FAL,
  DEL_CONTACT,
  DEL_CONTACT_SUC,
  DEL_CONTACT_FAL,
} from "../../constants/memberTypes";

const initialState = {
  isLoading: false,
  contacts: null,
};

const member = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_CONTACTS:
      case DEL_CONTACT:
        draft.isLoading = true;
        break;
      case GET_CONTACTS_SUC:
        draft.isLoading = false;
        draft.contacts = action.payload.contacts;
        break;
      case GET_CONTACTS_FAL:
        draft.isLoading = false;
        draft.contacts = [];
        break;

      case DEL_CONTACT_SUC:
      case DEL_CONTACT_FAL:
        draft.isLoading = false;
        break;

      default:
        break;
    }
  });

export default member;
