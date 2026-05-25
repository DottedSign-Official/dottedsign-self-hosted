import { produce } from "immer";

import {
  POST_VERIFY,
  POST_VERIFY_SUC,
  POST_VERIFY_FAL,
} from "../../constants/verifyTypes";

const initialState = {
  isLoading: false,
  isVerified: false,
};

const verify = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case POST_VERIFY:
        draft.isLoading = true;
        break;
      case POST_VERIFY_SUC:
        draft.isLoading = false;
        draft.isVerified = true;
        break;
      case POST_VERIFY_FAL:
        draft.isLoading = false;
        draft.isVerified = false;
        break;

      default:
        break;
    }
  });

export default verify;
