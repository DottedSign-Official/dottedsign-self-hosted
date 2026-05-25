import * as types from "../../constants/developerTypes";

export const retryCA = (data) => {
  return { type: types.RETRY_CA, payload: data };
};
export const getAllMembers = (payload) => {
  return { type: types.GET_ALL_MEMBERS, payload };
};

export const modifyMemberStatus = (payload) => {
  return { type: types.MODIFY_MEMBER_STATUS, payload };
};

export const getAllGroups = (payload) => {
  return { type: types.GET_ALL_GROUPS, payload };
};

export const updateGroup = (payload) => {
  return { type: types.UPDATE_GROUP, payload };
};

export const createGroup = (payload) => {
  return { type: types.CREATE_GROUP, payload };
};

export const assignGroupMember = (payload) => {
  return { type: types.ASSIGN_GROUP_MEMBER, payload };
};

export const removeMemberFromGroup = (payload) => {
  return { type: types.REMOVE_MEMBER_FROM_GROUP, payload };
};

export const putMemberRole = (payload) => {
  return { type: types.PUT_MEMBER_ROLE, payload };
};

export const getSidekiqRetryList = (payload) => {
  return { type: types.GET_SIDEKIQ_RETRY_LIST, payload };
};

export const postDeveloperRollback = (payload) => {
  return { type: types.POST_DEVELOPER_ROLLBACK, payload };
};
