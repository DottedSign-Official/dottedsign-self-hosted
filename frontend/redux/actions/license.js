import * as types from "../../constants/licenseTypes";

export const getLicense = () => {
  return { type: types.GET_LICENSE };
};
