import { produce } from "immer";

import {
  GET_LICENSE,
  GET_LICENSE_FAL,
  GET_LICENSE_SUC,
} from "../../constants/licenseTypes";

const initialState = {
  isLoading: false,
  data: null,
};

const license = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_LICENSE:
        draft.isLoading = true;
        break;

      case GET_LICENSE_FAL:
        draft.isLoading = false;
        break;

      case GET_LICENSE_SUC:
        draft.isLoading = false;
        draft.data = action.payload;
        break;

      default:
        break;
    }
  });

export default license;
