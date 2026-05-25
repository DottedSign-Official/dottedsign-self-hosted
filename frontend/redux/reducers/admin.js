import { produce } from "immer";

import {
  GET_ORGANIZATION,
  GET_ORGANIZATION_SUC,
  GET_ORGANIZATION_FAL,
  GET_ORGANIZATION_LIST_SUC,
  GET_TASKS_ADMIN,
  GET_TASKS_ADMIN_SUC,
  GET_TASKS_ADMIN_FAL,
  POST_GROUP,
  POST_GROUP_SUC,
  POST_GROUP_FAL,
  SET_DATE_CONDITIONS,
  SET_FOCUS_MEMBERS,
  SET_FOCUS_GROUP,
  SET_PAGE_CURRENT,
  PUT_ORGANIZATION,
  PUT_ORGANIZATION_SUC,
  PUT_ORGANIZATION_FAL,
  PUT_PERMISSIONS,
  PUT_PERMISSIONS_SUC,
  PUT_PERMISSIONS_FAL,
  GET_GROUP_MEMBER,
  GET_GROUP_MEMBER_SUC,
  GET_GROUP_MEMBER_FAL,
  GET_PERMISSIONS,
  GET_PERMISSIONS_SUC,
  GET_PERMISSIONS_FAL,
  GET_REPORTING_SUC,
  GET_REPORTING_MEMBER_SUC,
  GET_GROUP_PERMISSION,
  GET_GROUP_PERMISSION_SUC,
  GET_GROUP_PERMISSION_FAL,
  GET_DECLINE_REASONS,
  GET_DECLINE_REASONS_SUC,
  GET_DECLINE_REASONS_FAL,
  POST_GROUP_MEMBER,
  POST_GROUP_MEMBER_SUC,
  POST_GROUP_MEMBER_FAL,
  DEL_GROUP_MEMBER,
  DEL_GROUP_MEMBER_SUC,
  DEL_GROUP_MEMBER_FAL,
  GET_SYSTEM_CA_LIST,
  GET_SYSTEM_CA_LIST_SUC,
  GET_SYSTEM_CA_LIST_FAL,
  CREATE_SYSTEM_CA,
  CREATE_SYSTEM_CA_SUC,
  CREATE_SYSTEM_CA_FAL,
  GET_SYSTEM_CA_DETAIL,
  GET_SYSTEM_CA_DETAIL_SUC,
  GET_SYSTEM_CA_DETAIL_FAL,
  UPDATE_SYSTEM_CA,
  UPDATE_SYSTEM_CA_SUC,
  UPDATE_SYSTEM_CA_FAL,
  DELETE_SYSTEM_CA,
  DELETE_SYSTEM_CA_SUC,
  DELETE_SYSTEM_CA_FAL,
  UPDATE_SYSTEM_CA_MEMBERS,
  UPDATE_SYSTEM_CA_MEMBERS_SUC,
  UPDATE_SYSTEM_CA_MEMBERS_FAL,
  GET_ROLES_LIST_SUC,
  SET_ROLES_LIST,
} from "../../constants/adminTypes";

const initialState = {
  isLoading: false,
  role: null,
  roleList: null,
  rolePage: 1,
  roleTotalPage: 1,
  groupMember: null, // NOTE: only assigned
  organization: null,
  organizationList: [],
  currentOrganizationListPage: 1,
  totalOrganizationListPages: 1,
  totalOrganizationListCount: 1,
  dateConditions: null,
  pageTotal: null,
  pageCurrent: 1,
  focusMembers: [],
  focusGroup: null,
  tasksSummaryAdmin: null,
  tasksAdmin: null,
  permissions: null,
  reporting: null,
  reportingMember: null,
  tagsAdmin: null,
  groupPermission: null,
  systemCAList: null,
  systemCADetail: null,
};

const admin = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_ORGANIZATION:
      case GET_TASKS_ADMIN:
      case PUT_ORGANIZATION:
      case GET_GROUP_MEMBER:
      case GET_PERMISSIONS:
      case PUT_PERMISSIONS:
      case POST_GROUP:
      case GET_GROUP_PERMISSION:
      case GET_DECLINE_REASONS:
      case POST_GROUP_MEMBER:
      case DEL_GROUP_MEMBER:
      case GET_SYSTEM_CA_LIST:
      case CREATE_SYSTEM_CA:
      case GET_SYSTEM_CA_DETAIL:
      case UPDATE_SYSTEM_CA:
      case DELETE_SYSTEM_CA:
      case UPDATE_SYSTEM_CA_MEMBERS:
        draft.isLoading = true;
        break;

      case GET_ORGANIZATION_FAL:
      case GET_TASKS_ADMIN_FAL:
      case PUT_ORGANIZATION_SUC:
      case PUT_ORGANIZATION_FAL:
      case PUT_PERMISSIONS_SUC:
      case PUT_PERMISSIONS_FAL:
      case GET_GROUP_MEMBER_FAL:
      case GET_PERMISSIONS_FAL:
      case POST_GROUP_SUC:
      case POST_GROUP_FAL:
      case GET_GROUP_PERMISSION_FAL:
      case GET_DECLINE_REASONS_FAL:
      case POST_GROUP_MEMBER_SUC:
      case POST_GROUP_MEMBER_FAL:
      case DEL_GROUP_MEMBER_SUC:
      case DEL_GROUP_MEMBER_FAL:
      case GET_SYSTEM_CA_LIST_FAL:
      case CREATE_SYSTEM_CA_SUC:
      case CREATE_SYSTEM_CA_FAL:
      case GET_SYSTEM_CA_DETAIL_FAL:
      case UPDATE_SYSTEM_CA_SUC:
      case UPDATE_SYSTEM_CA_FAL:
      case DELETE_SYSTEM_CA_SUC:
      case DELETE_SYSTEM_CA_FAL:
      case UPDATE_SYSTEM_CA_MEMBERS_SUC:
      case UPDATE_SYSTEM_CA_MEMBERS_FAL:
        draft.isLoading = false;
        break;

      case GET_ORGANIZATION_SUC:
        draft.isLoading = false;
        draft.role = action.payload.role;
        draft.organization = action.payload.organization;
        break;

      case GET_ORGANIZATION_LIST_SUC:
        draft.organizationList = action.payload.organizationList;
        draft.currentOrganizationListPage =
          action.payload.currentOrganizationListPage;
        draft.totalOrganizationListPages =
          action.payload.totalOrganizationListPages;
        draft.totalOrganizationListCount =
          action.payload.totalOrganizationListCount;
        break;

      case GET_TASKS_ADMIN_SUC:
        draft.isLoading = false;
        draft.tasksSummaryAdmin = action.payload.summary;
        draft.tasksAdmin = action.payload.tasks;
        draft.pageTotal = action.payload.pageTotal;
        break;

      case SET_DATE_CONDITIONS:
        draft.dateConditions = action.payload;
        break;

      case SET_FOCUS_MEMBERS:
        draft.focusMembers = action.payload;
        break;
      case SET_FOCUS_GROUP:
        draft.focusGroup = action.payload;
        draft.pageCurrent = 1;
        break;
      case SET_PAGE_CURRENT:
        draft.pageCurrent = action.payload;
        break;

      case GET_GROUP_MEMBER_SUC:
        draft.isLoading = false;
        draft.groupMember = action.payload;
        break;

      case GET_PERMISSIONS_SUC:
        draft.isLoading = false;
        draft.permissions = action.payload;
        break;

      case GET_REPORTING_SUC:
        draft.isLoading = false;
        draft.reporting = action.payload;
        break;

      case GET_REPORTING_MEMBER_SUC:
        draft.isLoading = false;
        draft.reportingMember = action.payload;
        break;
      case GET_GROUP_PERMISSION_SUC:
        draft.isLoading = false;
        draft.groupPermission = action.payload;
        break;

      case GET_DECLINE_REASONS_SUC:
        draft.isLoading = false;
        draft.declineReasons = action.payload;
        break;

      case SET_ROLES_LIST:
      case GET_ROLES_LIST_SUC:
        draft.roleList = action.payload.roles;
        break;

      case GET_SYSTEM_CA_LIST_SUC:
        draft.isLoading = false;
        draft.systemCAList = action.payload;
        break;
      case GET_SYSTEM_CA_DETAIL_SUC:
        draft.isLoading = false;
        draft.systemCADetail = action.payload;
        break;
      default:
        break;
    }
  });

export default admin;
