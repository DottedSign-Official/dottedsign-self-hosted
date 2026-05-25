import { produce } from "immer";

import {
  POST_ACCEPTANCE,
  POST_ACCEPTANCE_SUC,
  POST_ACCEPTANCE_FAL,
} from "../../constants/acceptTypes";

const initialState = {
  isLoading: false,
  status: null,
  error: null,
};

const common = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case POST_ACCEPTANCE:
        draft.isLoading = true;

        break;
      case POST_ACCEPTANCE_SUC:
        draft.isLoading = false;
        draft.status = action.payload.status;
        break;

      case POST_ACCEPTANCE_FAL:
        draft.isLoading = false;
        draft.status = action.payload.status;
        draft.error = action.payload.error;
        break;

      default:
        break;
    }
  });

export default common;
