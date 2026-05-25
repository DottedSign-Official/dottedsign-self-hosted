import * as types from "../../constants/acceptTypes";

export const postAcceptance = (data) => {
  return { type: types.POST_ACCEPTANCE, data };
};
