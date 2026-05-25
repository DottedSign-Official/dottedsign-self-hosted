import { produce } from "immer";

import { SAVE_SIGN_SUC, SAVE_SIGN_GUEST_SUC } from "../../constants/signTypes";
import {
  SET_MOBILE_PANEL_URL,
  SET_MOBILE_PANEL_URL_SUC,
  SET_MOBILE_PANEL_URL_FAL,
  SET_PANEL_STATE,
  PANEL_STAGE,
} from "../../constants/signPanelTypes";

const initialState = {
  isLoading: false,
  qrcodeURL: null,
  state: PANEL_STAGE.SIGN_BROAD,
  remoteSignatureId: null,
  remoteGuestSignature: null,
};

const signPanel = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MOBILE_PANEL_URL:
        draft.isLoading = true;
        break;

      case SET_MOBILE_PANEL_URL_SUC:
        draft.isLoading = false;
        draft.qrcodeURL = action.payload.qrcodeURL;
        break;

      case SET_MOBILE_PANEL_URL_FAL:
        draft.isLoading = false;
        break;

      case SET_PANEL_STATE:
        draft.state = action.data;
        break;

      case SAVE_SIGN_SUC:
        draft.remoteSignatureId = action.payload.id;
        break;

      case SAVE_SIGN_GUEST_SUC:
        draft.remoteGuestSignature = action.payload.guestSignature;
        break;

      default:
        break;
    }
  });

export default signPanel;
