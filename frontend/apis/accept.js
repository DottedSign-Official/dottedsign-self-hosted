import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const postAccept = (data) => {
  const param = {
    app: "sign",
    path: PATH.postAccept,
    method: "POST",
    data,
  };

  return invokeApi(param);
};
