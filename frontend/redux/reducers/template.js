import { produce } from "immer";

import {
  FETCHING_TEMPLATE,
  GET_TEMPLATES_ALL,
  GET_TEMPLATES_SUC,
  GET_TEMPLATES_FAL,
  DEL_TEMPLATE,
  DEL_TEMPLATE_SUC,
  DEL_TEMPLATE_FAL,
  SET_LABEL,
  SET_PAGE,
  SET_SEARCH_CONTENT,
  SET_SEARCH_ITEM,
  SET_TEMPLATE,
  PUT_TEMPLATE_SETTINGS,
  PUT_TEMPLATE_SETTINGS_SUC,
  PUT_TEMPLATE_SETTINGS_FAL,
  GET_TEMPLATE_SHARE_INFO,
  GET_TEMPLATE_SHARE_INFO_SUC,
  GET_TEMPLATE_SHARE_INFO_FAL,
  DEL_TEMPLATE_SHARE_INFO,
  PUT_TEMPLATE_SHARE,
  PUT_TEMPLATE_SHARE_SUC,
  PUT_TEMPLATE_SHARE_FAL,
  GET_TEMPLATE_SHARE_LIST,
  GET_TEMPLATE_SHARE_LIST_SUC,
  GET_TEMPLATE_SHARE_LIST_FAL,
  PUT_TEMPLATE_ADMIN_SHARE_SUC,
  PUT_TEMPLATE_ADMIN_SHARE_FAL,
  DELETE_TEMPLATE_ADMIN_SHARE_SUC,
  DELETE_TEMPLATE_ADMIN_SHARE_FAL,
  DUPLICATE_TEMPLATE,
  DUPLICATE_TEMPLATE_SUC,
  DUPLICATE_TEMPLATE_FAL,
} from "../../constants/templateTypes";

import { TEMPLATE_SEARCH_TYPE } from "../../constants/constants";

const search = {
  searchContent: "",
  searchType: TEMPLATE_SEARCH_TYPE.name,
};

const initialState = {
  ...search,
  isLoading: false,
  labelFocus: [],
  templateFocus: null,
  pageFocus: 1,
  pageAll: null,
  templatesCount: null,
  templatesShareCount: null,
  templates: null,
  templateShareInfo: null,

  currentPage: 1,
  totalPages: null,
  totalTemplates: null,
  templateShareList: [],
};

const template = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FETCHING_TEMPLATE:
      case DEL_TEMPLATE:
      case PUT_TEMPLATE_SETTINGS:
      case GET_TEMPLATE_SHARE_INFO:
      case PUT_TEMPLATE_SHARE:
      case GET_TEMPLATE_SHARE_LIST:
      case DUPLICATE_TEMPLATE:
        draft.isLoading = true;
        break;

      case GET_TEMPLATES_FAL:
      case DEL_TEMPLATE_SUC:
      case DEL_TEMPLATE_FAL:
      case PUT_TEMPLATE_SETTINGS_SUC:
      case PUT_TEMPLATE_SETTINGS_FAL:
      case GET_TEMPLATE_SHARE_INFO_FAL:
      case PUT_TEMPLATE_SHARE_SUC:
      case PUT_TEMPLATE_SHARE_FAL:
      case GET_TEMPLATE_SHARE_LIST_FAL:
      case PUT_TEMPLATE_ADMIN_SHARE_SUC:
      case PUT_TEMPLATE_ADMIN_SHARE_FAL:
      case DELETE_TEMPLATE_ADMIN_SHARE_SUC:
      case DELETE_TEMPLATE_ADMIN_SHARE_FAL:
      case DUPLICATE_TEMPLATE_SUC:
      case DUPLICATE_TEMPLATE_FAL:
        draft.isLoading = false;
        break;

      case GET_TEMPLATES_ALL:
        draft.labelFocus = initialState.labelFocus;
        draft.searchContent = initialState.searchContent;
        draft.searchType = initialState.searchType;
        draft.pageFocus = initialState.pageFocus;
        break;

      case GET_TEMPLATES_SUC:
        draft.isLoading = false;
        draft.templatesCount = action.payload.templatesCount;
        draft.templatesShareCount = action.payload.templatesShareCount;
        draft.templates = action.payload.templates;
        draft.pageAll = action.payload.pages;
        break;

      case SET_LABEL:
        draft.labelFocus = action.payload;
        draft.pageFocus = 1;
        break;

      case SET_PAGE:
        draft.pageFocus = action.payload;
        break;

      case SET_SEARCH_CONTENT:
        draft.searchContent = action.payload;
        draft.pageFocus = 1;
        break;

      case SET_SEARCH_ITEM:
        draft.searchType = action.payload;
        break;

      case SET_TEMPLATE:
        draft.templateFocus = action.payload;
        break;

      case GET_TEMPLATE_SHARE_INFO_SUC:
        draft.templateShareInfo = action.payload;
        break;
      case DEL_TEMPLATE_SHARE_INFO:
        draft.templateShareInfo = null;
        break;

      case GET_TEMPLATE_SHARE_LIST_SUC:
        draft.isLoading = false;
        draft.currentPage = action.payload.currentPage;
        draft.totalPages = action.payload.totalPages;
        draft.totalTemplates = action.payload.totalTemplates;
        draft.templateShareList = action.payload.templateShareList;
        break;

      default:
        break;
    }
  });

export default template;
