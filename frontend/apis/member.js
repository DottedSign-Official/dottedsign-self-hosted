import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";

export const postAvatarUpload = ({ data }) => {
  const accessToken = Cookie.get("access_token");

  let formData = new FormData();
  formData.append("avatar", data.file[0].file);

  const apiHost = getAPIHost();
  const url = `${apiHost}/api/v1/members/upload_avatar`;

  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  };

  return fetch(url, option)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.warn(error));
};

export const postUpload = ({ file, url }) => {
  const option = {
    method: "PUT",
    body: file,
  };

  return fetch(url, option)
    .then((res) => res.json())
    .then((res) => res)
    .catch((error) => console.warn(error));
};

export const getContacts = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.getContacts,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};
