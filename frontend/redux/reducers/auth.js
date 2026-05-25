import { produce } from "immer";

import {
  SET_USER,
  CLEAR_USER,
  SET_GROUP,
  PUT_USER,
  PUT_USER_SUC,
  PUT_USER_FAL,
  PUT_PASSWORD,
  PUT_PASSWORD_SUC,
  PUT_PASSWORD_FAL,
  PUT_PREFERENCE,
  PUT_PREFERENCE_SUC,
  PUT_PREFERENCE_FAL,
  GET_PROFILE,
  GET_PROFILE_SUC,
  GET_PROFILE_FAL,
  PUT_PROFILE,
  PUT_PROFILE_SUC,
  PUT_PROFILE_FAL,
  SET_FEATURE_ENABLE,
  SET_FRONT_DESK_INI,
  CLEAR_FRONT_DESK,
  SET_PUBLIC_FORM_INI,
  CLEAR_PUBLIC_FORM,
  SAVE_GUEST_SIGN_LAST_USE,
  CLEAR_GUEST_SIGN_LAST_USE,
} from "../../constants/authTypes";

const initialState = {
  isLoading: false,
  isLoadingUser: false,
  user: null,
  organization: null,
  isVerified: null,
  isFake: false,
  features: null,
  isFrontDesk: false,
  isPublicFormSigning: false,
  guestSignLastUse: null,
};

const auth = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER:
        draft.isFake = action.payload.isFake ? true : false;
        if (!action.payload.user) {
          return;
        }
        draft.isVerified = action.payload.user?.confirmed;
        draft.user = {
          ...state.user,
          ...action.payload.user,
          lang: action.payload.user?.lang?.toLowerCase(),
        };
        break;

      case CLEAR_USER:
        draft = initialState;
        break;
      case SET_GROUP:
        draft.organization = action.payload.org;
        break;

      case PUT_USER:
        draft.isLoadingUser = true;
        break;
      case PUT_USER_SUC:
      case PUT_USER_FAL:
        draft.isLoadingUser = false;
        break;

      case PUT_PASSWORD:
      case PUT_PREFERENCE:
      case GET_PROFILE:
      case PUT_PROFILE:
        draft.isLoading = true;
        break;

      case PUT_PASSWORD_SUC:
      case PUT_PASSWORD_FAL:
      case PUT_PREFERENCE_SUC:
      case PUT_PREFERENCE_FAL:
      case GET_PROFILE_FAL:
      case PUT_PROFILE_SUC:
      case PUT_PROFILE_FAL:
        draft.isLoading = false;
        break;

      case GET_PROFILE_SUC:
        draft.isLoading = false;
        draft.user = {
          ...state.user,
          profile: action.payload,
        };
        break;

      case SET_FEATURE_ENABLE:
        draft.features = action.payload;
        break;

      case SET_FRONT_DESK_INI:
        draft.isFrontDesk = true;
        break;

      case CLEAR_FRONT_DESK:
        draft.isFrontDesk = false;
        break;

      case SET_PUBLIC_FORM_INI:
        draft.isPublicFormSigning = true;
        draft.isFake = true;
        break;
      case CLEAR_PUBLIC_FORM:
        draft.isPublicFormSigning = false;
        draft.isFake = false;
        draft.user = null;
        break;

      case SAVE_GUEST_SIGN_LAST_USE:
        draft.guestSignLastUse = action.payload;
        break;
      case CLEAR_GUEST_SIGN_LAST_USE:
        draft.guestSignLastUse = null;
        break;

      default:
        break;
    }
  });

export default auth;
