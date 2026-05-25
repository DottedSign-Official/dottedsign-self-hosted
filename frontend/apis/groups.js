import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const getGroupDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id } = data;

  const param = {
    app: "sign",
    path: PATH.groupDeclineReason,
    method: "GET",
    accessToken,
    data: {
      group_id,
    },
  };

  return invokeApi(param);
};

export const postGroupDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id, content } = data;
  const param = {
    app: "sign",
    path: PATH.groupDeclineReason,
    method: "POST",
    accessToken,
    data: {
      group_id,
      content,
    },
  };

  return invokeApi(param);
};

export const putGroupDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id, decline_reason_id, content } = data;
  const param = {
    app: "sign",
    path: PATH.groupDeclineReason,
    method: "PUT",
    accessToken,
    data: {
      group_id,
      decline_reason_id,
      content,
    },
  };

  return invokeApi(param);
};

export const deleteGroupDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id, decline_reason_id } = data;
  const param = {
    app: "sign",
    path: PATH.groupDeclineReason,
    method: "DELETE",
    accessToken,
    data: {
      group_id,
      decline_reason_id,
    },
  };

  return invokeApi(param);
};
