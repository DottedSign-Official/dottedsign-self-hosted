import * as types from "../../constants/verifyTypes";

export const postVerify = (data) => {
  return { type: types.POST_VERIFY, data };
};
