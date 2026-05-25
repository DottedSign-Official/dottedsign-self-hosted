import { produce } from "immer";

import {
  GET_LABELS,
  GET_LABELS_SUC,
  GET_LABELS_FAL,
  CREATE_LABEL,
  CREATE_LABEL_SUC,
  CREATE_LABEL_FAL,
  PUT_LABEL,
  PUT_LABEL_SUC,
  PUT_LABEL_FAL,
  DEL_LABEL,
  DEL_LABEL_SUC,
  DEL_LABEL_FAL,
  RESET_LABELS,
  SET_LABEL_FOCUS,
  MANAGE_LABEL,
  MANAGE_LABEL_SUC,
  MANAGE_LABEL_FAL,
} from "../../constants/labelTypes";

const initialState = {
  isLoading: false,
  labels: null,
  labelFocus: null,

  groupCommonList: null, // NOTE: batch
  groupDiffList: null, // NOTE: batch
  groupUnusedList: null, // NOTE: batch
};

const label = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_LABELS:
      case CREATE_LABEL:
      case PUT_LABEL:
      case DEL_LABEL:
      case MANAGE_LABEL:
        draft.isLoading = true;
        break;

      case GET_LABELS_SUC:
        draft.isLoading = false;
        draft.labels = action.payload;
        break;

      case RESET_LABELS:
        draft.labels = null;
        break;

      case GET_LABELS_FAL:
      case CREATE_LABEL_FAL:
      case CREATE_LABEL_SUC:
      case PUT_LABEL_SUC:
      case PUT_LABEL_FAL:
      case DEL_LABEL_SUC:
      case DEL_LABEL_FAL:
      case MANAGE_LABEL_SUC:
      case MANAGE_LABEL_FAL:
        draft.isLoading = false;
        break;

      case SET_LABEL_FOCUS:
        draft.labelFocus = action.payload;
        break;

      default:
        break;
    }
  });

export default label;
