import { produce } from "immer";

import {
  GET_BULKS,
  GET_BULKS_SUC,
  GET_BULKS_FAL,
  // NOTE: Signing Group Actions
  GET_SIGNING_GROUP,
  GET_SIGNING_GROUP_SUC,
  GET_SIGNING_GROUP_FAL,
  SET_SIGNING_GROUP_CURRENT_PAGE,
  POST_SIGNING_GROUP,
  POST_SIGNING_GROUP_SUC,
  POST_SIGNING_GROUP_FAL,
  PUT_SIGNING_GROUP,
  PUT_SIGNING_GROUP_SUC,
  PUT_SIGNING_GROUP_FAL,
  DEL_SIGNING_GROUP,
  DEL_SIGNING_GROUP_SUC,
  DEL_SIGNING_GROUP_FAL,
  POST_SHARE_SIGNING_GROUP,
  POST_SHARE_SIGNING_GROUP_SUC,
  POST_SHARE_SIGNING_GROUP_FAL,
} from "../../constants/settingsTypes";

const initialState = {
  isLoading: false,
  bulkSendPages: 1,
  bulkSendMissions: null,
  // NOTE: Signing Group Actions
  signingGroupTotalAmount: 0,
  signingGroup: null,
  signingGroupCurrentPage: 1,
  signingGroupTotalPages: 1,
};

const settings = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_BULKS:
      case GET_SIGNING_GROUP:
      case POST_SIGNING_GROUP:
      case PUT_SIGNING_GROUP:
      case DEL_SIGNING_GROUP:
      case POST_SHARE_SIGNING_GROUP:
        draft.isLoading = true;
        break;

      case GET_BULKS_FAL:
      case GET_SIGNING_GROUP_FAL:
      case POST_SIGNING_GROUP_SUC:
      case POST_SIGNING_GROUP_FAL:
      case PUT_SIGNING_GROUP_SUC:
      case PUT_SIGNING_GROUP_FAL:
      case DEL_SIGNING_GROUP_SUC:
      case DEL_SIGNING_GROUP_FAL:
      case POST_SHARE_SIGNING_GROUP_SUC:
      case POST_SHARE_SIGNING_GROUP_FAL:
        draft.isLoading = false;
        break;

      case GET_BULKS_SUC:
        draft.isLoading = false;
        draft.bulkSendPages = action.payload.total_pages;
        draft.bulkSendMissions = action.payload.missions;
        break;

      case GET_SIGNING_GROUP_SUC:
        draft.isLoading = false;
        draft.signingGroupTotalAmount = action.payload.total_count || 0;
        draft.signingGroup = action.payload.combinations;
        draft.signingGroupTotalPages = action.payload.total_pages;
        break;
      case SET_SIGNING_GROUP_CURRENT_PAGE:
        draft.signingGroupCurrentPage = action.payload;
        break;

      default:
        break;
    }
  });

export default settings;
