import { produce } from "immer";

import {
  LOGIN,
  LOGIN_SUC,
  LOGIN_FAL,
  REGSITER,
  REGSITER_SUC,
  REGSITER_FAL,
  FORGET_PWD,
  FORGET_PWD_SUC,
  FORGET_PWD_FAL,
  RESET_PWD,
  RESET_PWD_SUC,
  RESET_PWD_FAL,
  SET_MODE,
} from "../../constants/loginTypes";
import { LOGIN_STATE } from "../../constants/constants";

const initialState = {
  mode: LOGIN_STATE.ACCOUNT,
  isLoading: false,
};

const common = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN:
      case REGSITER:
      case FORGET_PWD:
      case RESET_PWD:
        draft.isLoading = true;
        break;
      case LOGIN_FAL:
      case REGSITER_FAL:
      case FORGET_PWD_FAL:
      case RESET_PWD_FAL:
        draft.isLoading = false;
        break;
      case LOGIN_SUC:
        draft.mode = LOGIN_STATE.LOGIN;
        draft.isLoading = false;
        break;
      case FORGET_PWD_SUC:
        draft.mode = LOGIN_STATE.FORGET_MAIL_SEND_SUC;
        draft.isLoading = false;
        break;
      case REGSITER_SUC:
        draft.mode = LOGIN_STATE.SIGNUP_SUC;
        draft.isLoading = false;
        break;
      case RESET_PWD_SUC:
        draft.mode = LOGIN_STATE.RESET_PWD_SUC;
        draft.isLoading = false;
        break;
      case SET_MODE:
        draft.mode = action.data;
        break;
      default:
        break;
    }
  });

export default common;
