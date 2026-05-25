import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const getLicense = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    path: PATH.license,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};
