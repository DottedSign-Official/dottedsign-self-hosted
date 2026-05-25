import { produce } from "immer";

import {
  OPEN_TOAST,
  CLOSE_TOAST,
  OPEN_MODAL,
  CLOSE_MODAL,
  GET_COUNTRIES_SUC,
  OPEN_COVER,
  CLEAR_COVER,
} from "../../constants/commonTypes";

const initialState = {
  isToast: false,
  toastId: null,
  toastType: null,
  toastData: null,

  modalType: null,
  modalData: null,

  countries: null,

  coverType: null,
  coverData: null,
};

const common = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case OPEN_TOAST:
        draft.isToast = true;
        draft.toastId = action.toastId ? action.toastId : null;
        draft.toastType = action.payload;
        draft.toastData = action.data;
        break;
      case CLOSE_TOAST:
        draft.isToast = false;
        draft.toastId = null;
        draft.toastType = null;
        break;

      case OPEN_MODAL:
        draft.modalType = action.payload.modalType;
        draft.modalData = action.payload.modalData;
        break;
      case CLOSE_MODAL:
        draft.modalType = null;
        draft.modalData = null;
        break;

      case GET_COUNTRIES_SUC:
        draft.countries = action.payload;
        break;

      case OPEN_COVER:
        draft.coverType = action.payload.coverType;
        draft.coverData = action.payload.coverData;
        break;

      case CLEAR_COVER:
        draft.coverType = null;
        draft.coverData = null;
        break;

      default:
        break;
    }
  });

export default common;
