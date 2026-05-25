import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const postVerify = (data) => {
  const param = {
    app: "rabbit",
    path: PATH.postVerify,
    method: "POST",
    data,
  };

  return invokeApi(param);
};

export default postVerify;
