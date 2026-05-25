import Cookie from "js-cookie";
import queryString from "query-string";
import { invokeApi } from "../helpers/apiHelper";
import { getUnix, unixToString } from "../helpers/time";
import { downloadFromBlob } from "../helpers/download";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";

export const getPublicFormPreview = (data) => {
  const param = {
    app: "sign",
    path: `${PATH.publicForm}/preview`,
    method: "GET",
    data,
  };

  return invokeApi(param);
};

export const startPublicForm = (data) => {
  const param = {
    app: "sign",
    path: `${PATH.publicForm}/form_tasks/start`,
    method: "POST",
    data,
  };

  return invokeApi(param);
};

export const getPublicFormAll = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.publicForm,
    method: "GET",
    accessToken,
    data,
  };
  return invokeApi(param);
};

export const deletePublicForm = (id) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: `${PATH.publicForm}/${id}`,
    method: "DELETE",
    accessToken,
  };
  return invokeApi(param);
};

export const getPublicFormCsv = (data) => {
  const accessToken = Cookie.get("access_token");
  const { form_id, title, search_keys } = data;

  const options = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "blob",
  };

  const payload = {
    form_id,
    search_keys,
  };

  const keys = queryString.stringify(payload, { arrayFormat: "bracket" });

  const url = `${getAPIHost()}${PATH.publicForm}/export_csv?${keys}`;

  return fetch(url, options)
    .then((res) => {
      if (res.status !== 200) {
        return null;
      }
      return res.blob();
    })
    .then((blob) => {
      if (!blob) {
        return { error: true };
      }

      const secNow = getUnix(new Date());
      const timestamp = unixToString(secNow).substring(0, 10);
      const fileName = `${title} - ${timestamp}`;
      downloadFromBlob(false, blob, `${fileName}.csv`);
      return {};
    })
    .catch((error) => ({ error: true, message: error.message }));
};

export const putPublicFormStatus = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.publicForm}/change_status`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putPublicFormCompress = (data) => {
  const accessToken = Cookie.get("access_token");
  const ip = Cookie.get("client_ip");

  const url = `${getAPIHost()}${PATH.publicForm}/compress`;
  const payload = Object.assign({}, data, {
    client: "web",
    ip_address: ip || null,
  });

  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  };

  return fetch(url, options)
    .then((res) => {
      if (res.status !== 200) {
        return null;
      }
      return res.blob();
    })
    .then((blob) => {
      if (!blob) {
        return { error: true };
      }

      const fileName = `public-form-${data?.form_id || "download"}.zip`;
      downloadFromBlob(false, blob, fileName);
      return {};
    })
    .catch((error) => ({ error: true, message: error.message }));
};
