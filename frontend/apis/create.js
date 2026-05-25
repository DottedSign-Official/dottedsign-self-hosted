import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";

export const postEnvelopeDraft = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.signEnvelope,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postDraft = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.signTask,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postDraftStart = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postDraftStart,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postEnvelopeDraftStart = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signEnvelope}/start`,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putDraft = (data) => {
  const accessToken = Cookie.get("access_token");
  const { taskId, ...res } = data;

  const param = {
    app: "sign",
    path: `${PATH.signTask}/${taskId}`,
    method: "PUT",
    accessToken,
    data: res,
  };

  return invokeApi(param);
};

export const putEnvelopeDraft = (data) => {
  const accessToken = Cookie.get("access_token");
  const { envelopeId, ...res } = data;

  const param = {
    app: "sign",
    path: `${PATH.signEnvelope}/${envelopeId}`,
    method: "PUT",
    accessToken,
    data: res,
  };

  return invokeApi(param);
};

export const postSignAndSend = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postSignAndSend,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/${data}`,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const postTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.template,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putTemplate = (data) => {
  const { templateId, ...res } = data;
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/${templateId}`,
    method: "PUT",
    accessToken,
    data: res,
  };

  return invokeApi(param);
};

export const postTemplateFileShare = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/file_share`,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getBulkCsv = async ({ templateId }) => {
  const accessToken = Cookie.get("access_token");

  const options = {
    method: "GET",
    headers: { "Content-type": "text/csv" },
    responseType: "blob",
  };

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  const apiHost = getAPIHost();
  let url = `${apiHost}${PATH.bulk}/sample?template_id=${templateId}`;

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const json = await res.json();
      return {
        error: true,
        error_code: json.error_code || null,
      };
    }

    const blob = await res.blob();
    return { error: false, blob };
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const postBulk = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.bulk}/create_mission`,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getAssigneeSystemCAList = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: `${PATH.systemCA}/system_ca_list_from_email`,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};
export const postKiosk = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postKiosk,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postPublicForm = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.publicForm,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postPublicFormWithTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.publicForm}/create_from_template`,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putPublicForm = (data) => {
  const accessToken = Cookie.get("access_token");
  const { id, ...res } = data;

  const param = {
    app: "sign",
    path: `${PATH.publicForm}/${id}`,
    method: "PUT",
    accessToken,
    data: res,
  };

  return invokeApi(param);
};

export const getPublicForm = (formId) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.publicForm}/${formId}`,
    method: "GET",
    accessToken,
    data: { with_detail: true },
  };

  return invokeApi(param);
};
