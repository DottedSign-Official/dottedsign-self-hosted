import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import { downloadFromBlob } from "../helpers/download";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";

export const getBulks = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: `${PATH.bulk}/missions`,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const getBulkFile = (uuid) => {
  const accessToken = Cookie.get("access_token");

  const options = {
    method: "GET",
    headers: { "Content-type": "application/zip" },
    responseType: "arraybuffer",
  };

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  const apiHost = getAPIHost();
  let url = `${apiHost}${PATH.bulk}/download?mission_uuid=${uuid}`;

  return fetch(url, options)
    .then((res) => res.blob())
    .then((blob) => downloadFromBlob(false, blob, "mission.zip"))
    .catch((error) => ({ error: true, message: error.message }));
};

export const getSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const payload = {
    ...data,
    category: "dummy_stages",
  };

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/list`,
    method: "GET",
    accessToken,
    data: payload,
  };
  return invokeApi(param);
};

export const getSignigGroupDetail = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/${data.combination_id}`,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const postSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.signingGroup,
    method: "POST",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const delSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/${data.combination_id}`,
    method: "DELETE",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const putSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/${data.combination_id}`,
    method: "PUT",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const getShareSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/share_info`,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};
export const postShareSigningGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signingGroup}/group_share`,
    method: "POST",
    accessToken,
    data,
  };
  return invokeApi(param);
};
