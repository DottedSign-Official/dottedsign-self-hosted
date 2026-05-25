import { produce } from "immer";

import {
  FETCHING_DEVELOPER,
  GET_ALL_MEMBERS,
  GET_ALL_MEMBERS_SUC,
  GET_ALL_MEMBERS_FAL,
  MODIFY_MEMBER_STATUS_SUC,
  MODIFY_MEMBER_STATUS_FAL,
  GET_ALL_GROUPS,
  GET_ALL_GROUPS_SUC,
  GET_ALL_GROUPS_FAL,
  RETRY_CA,
  RETRY_CA_SUC,
  RETRY_CA_FAL,
  GET_SIDEKIQ_RETRY_LIST,
  GET_SIDEKIQ_RETRY_LIST_SUC,
  GET_SIDEKIQ_RETRY_LIST_FAL,
} from "../../constants/developerTypes";

const initialState = {
  isLoading: false,
  members: [],
  groups: [],
  currentPage: 1,
  totalPages: 1,
  sidekiqRetryList: [],
};

const developer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case RETRY_CA:
        draft.isLoading = true;
        break;
      case RETRY_CA_SUC:
      case RETRY_CA_FAL:
        draft.isLoading = false;
        break;

      case FETCHING_DEVELOPER:
      case GET_ALL_MEMBERS:
      case GET_ALL_GROUPS:
      case GET_SIDEKIQ_RETRY_LIST:
        draft.isLoading = true;
        break;

      case GET_ALL_MEMBERS_FAL:
      case MODIFY_MEMBER_STATUS_SUC:
      case MODIFY_MEMBER_STATUS_FAL:
      case GET_ALL_GROUPS_FAL:
      case GET_SIDEKIQ_RETRY_LIST_FAL:
        draft.isLoading = false;
        break;

      case GET_ALL_MEMBERS_SUC:
        draft.isLoading = false;
        draft.members = action.payload.members;
        draft.currentPage = action.payload.currentPage;
        draft.totalPages = action.payload.totalPages;
        break;

      case GET_ALL_GROUPS_SUC:
        draft.isLoading = false;
        draft.groups = action.payload.groups;
        draft.currentPage = action.payload.currentPage;
        draft.totalPages = action.payload.totalPages;
        break;

      case GET_SIDEKIQ_RETRY_LIST_SUC:
        draft.isLoading = false;
        draft.sidekiqRetryList = action.payload.sidekiqRetryList;
        break;

      default:
        break;
    }
  });

export default developer;
