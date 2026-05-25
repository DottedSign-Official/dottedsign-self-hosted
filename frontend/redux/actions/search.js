import * as types from "../../constants/searchTypes";

export const resetSearch = () => {
  return { type: types.RESET_SEARCH };
};

export const getTasksSearch = (payload) => {
  return { type: types.GET_TASKS_SEARCH, payload };
};

export const setConditions = (payload) => {
  return { type: types.SET_CONDITIONS, payload };
};

export const getTaskSearchDeveloper = (payload) => {
  return { type: types.GET_TASKS_SEARCH_DEVELOPER, payload };
};

export const getTaskSearchDeveloperDetail = (payload) => {
  return { type: types.GET_TASKS_SEARCH_DEVELOPER_DETAIL, payload };
};
