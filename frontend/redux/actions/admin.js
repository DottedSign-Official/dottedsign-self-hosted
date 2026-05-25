import * as types from "../../constants/adminTypes";

export const getOrganization = () => {
  return { type: types.GET_ORGANIZATION };
};

export const setOrganization = (data) => {
  return { type: types.GET_ORGANIZATION_SUC, payload: data };
};

export const getOrganizationList = (data) => {
  return { type: types.GET_ORGANIZATION_LIST, payload: data };
};

export const postGroup = (data) => {
  return { type: types.POST_GROUP, payload: data };
};

export const setFocusMembers = (data) => {
  return { type: types.SET_FOCUS_MEMBERS, payload: data };
};

export const setFocusGroup = (data) => {
  return { type: types.SET_FOCUS_GROUP, payload: data };
};

export const setPageCurrent = (data) => {
  return { type: types.SET_PAGE_CURRENT, payload: data };
};

export const setDateConditions = (data) => {
  return { type: types.SET_DATE_CONDITIONS, payload: data };
};

export const setSearchConditions = (data) => {
  return { type: types.SET_SEARCH_CONDITIONS, payload: data };
};

export const getTasksAdmin = (data) => {
  return { type: types.GET_TASKS_ADMIN, payload: data };
};

export const getGroupMember = () => {
  return { type: types.GET_GROUP_MEMBER };
};

export const setMemberRole = (data) => {
  return { type: types.SET_MEMBER_ROLE, data };
};

export const delGroupMember = (data) => {
  return { type: types.DEL_GROUP_MEMBER, data };
};

export const postGroupMember = (data) => {
  return { type: types.POST_GROUP_MEMBER, data };
};

export const putOrganization = (data) => {
  return { type: types.PUT_ORGANIZATION, payload: data };
};

export const getReporting = (data) => {
  return { type: types.GET_REPORTING, payload: data };
};

export const getReportingMember = (data) => {
  return { type: types.GET_REPORTING_MEMBER, payload: data };
};

export const getPermissions = () => {
  return { type: types.GET_PERMISSIONS };
};

export const putPermissions = (data) => {
  return { type: types.PUT_PERMISSIONS, payload: data };
};

export const getGroupPermission = () => {
  return { type: types.GET_GROUP_PERMISSION };
};

export const getDeclineReasons = (data) => {
  return { type: types.GET_DECLINE_REASONS, payload: data };
};

export const setDeclineReason = (data) => {
  return { type: types.SET_DECLINE_REASONS, payload: data };
};

export const deleteDeclineReason = (data) => {
  return { type: types.DEL_DECLINE_REASONS, payload: data };
};

export const getSystemCAList = () => {
  return { type: types.GET_SYSTEM_CA_LIST };
};

export const createSystemCA = (data) => {
  return { type: types.CREATE_SYSTEM_CA, payload: data };
};

export const getSystemCADetail = (data) => {
  return { type: types.GET_SYSTEM_CA_DETAIL, payload: data };
};

export const updateSystemCA = (data) => {
  return { type: types.UPDATE_SYSTEM_CA, payload: data };
};

export const deleteSystemCA = (data) => {
  return { type: types.DELETE_SYSTEM_CA, payload: data };
};

export const updateSystemCAMembers = (data) => {
  return { type: types.UPDATE_SYSTEM_CA_MEMBERS, payload: data };
};
export const getRolesList = (data) => {
  return { type: types.GET_ROLES_LIST, payload: data };
};

export const clearRoleList = () => {
  return { type: types.SET_ROLES_LIST, payload: { roles: null } };
};

export const changeRolePriority = (data) => {
  return { type: types.CHANGE_ROLE_PRIORITY, payload: data };
};

export const createRole = (data) => {
  return { type: types.CREATE_ROLE, payload: data };
};

export const deleteRole = (data) => {
  return { type: types.DELETE_ROLE, payload: data };
};

export const postAdminReissueTask = (data) => {
  return { type: types.POST_ADMIN_REISSUE_TASK, payload: data };
};
