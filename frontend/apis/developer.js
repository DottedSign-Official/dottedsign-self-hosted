import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import PATH from "../constants/apiPath";

export const retryCA = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    path: PATH.retryCA,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};
export const getAllMembers = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.getAllMembers,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const modifyMemberStatus = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.modifyMemberStatus,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getAllGroups = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.developerGroup,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const updateGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.developerGroup,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const createGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.developerGroup,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const assignGroupMember = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.assignGroupMember,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const removeMemberFromGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.removeMemberFromGroup,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putMemberRole = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.changeMemberRole,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getSidekiqRetryList = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.getSidekiqRetryList,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postDeveloperRollback = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "developer",
    path: PATH.postDeveloperRollback,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};
