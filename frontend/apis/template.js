import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const getTemplates = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.template,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const delTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/${data.templateId}`,
    method: "DELETE",
    accessToken,
  };

  return invokeApi(param);
};

export const getTemplateShareInfo = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/share_info?template_id=${data.templateId}`,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const putTemplateShare = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.templateShare}/share_template`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getTemplateShareList = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.templateShare}/share_list`,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putTemplateAdminShare = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.templateShare}/admin_share`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const deleteTemplateAdminShare = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.templateShare}/admin_remove_share`,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const duplicateTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.template}/duplicate`,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};
