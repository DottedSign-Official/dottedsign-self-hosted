import { produce } from "immer";

import {
  SET_IS_PUBLIC_FORM,
  SET_PREVIEW_EMAIL,
  GET_PUBLIC_FORM_PREVIEW,
  GET_PUBLIC_FORM_PREVIEW_SUC,
  GET_PUBLIC_FORM_PREVIEW_FAL,
  SET_TAB_ACTIVE,
  PUT_PUBLIC_FORM_COMPRESS,
  PUT_PUBLIC_FORM_COMPRESS_SUC,
  PUT_PUBLIC_FORM_COMPRESS_FAL,
  GET_PUBLIC_FORM_ALL,
  GET_PUBLIC_FORM_ALL_SUC,
  GET_PUBLIC_FORM_ALL_FAL,
  SET_PUBLIC_FORM_CURRENT_PAGE,
  SET_PUBLIC_FORM_PER_PAGE,
  SET_PUBLIC_FORM_SEARCH_TERM,
  DELETE_PUBLIC_FORM,
  DELETE_PUBLIC_FORM_SUC,
  DELETE_PUBLIC_FORM_FAL,
  GET_PUBLIC_FORM_CSV,
  GET_PUBLIC_FORM_CSV_SUC,
  GET_PUBLIC_FORM_CSV_FAL,
  RESET_PUBLIC_FORM,
  UPDATE_PUBLIC_FORM_CONDITION,
} from "../../constants/publicFormTypes";
import { PUBLIC_FORM_PER_PAGE } from "../../constants/constants";

const initialState = {
  isLoading: false,
  isFetchError: null,
  isFileDeleted: false,
  errorType: null,
  info: {},
  loaded: false,
  title: "",
  fileUrl: "",
  files: {},
  currentTab: "",
  shareStatus: {},
  shareTab: null,
  resourceLength: 0,
  loadedCounter: 0,
  member_involved: false,
  signerEmail: null,

  tabActive: "my_public_forms",
  publicFormUsage: null,
  publicFormAll: [],
  publicFormCurrentPage: 1,
  publicFormTotalPages: 1,
  publicFormPerPage: PUBLIC_FORM_PER_PAGE,
  publicFormSearchTerm: "",
};

const publicForm = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_PUBLIC_FORM:
        draft.isPublicForm = action.payload;
        break;

      case SET_PREVIEW_EMAIL:
        draft.signerEmail = action.payload;
        break;

      case GET_PUBLIC_FORM_PREVIEW:
      case GET_PUBLIC_FORM_ALL:
      case DELETE_PUBLIC_FORM:
      case GET_PUBLIC_FORM_CSV:
      case PUT_PUBLIC_FORM_COMPRESS:
        draft.isLoading = true;
        break;

      case GET_PUBLIC_FORM_PREVIEW_FAL:
      case GET_PUBLIC_FORM_ALL_FAL:
      case DELETE_PUBLIC_FORM_SUC:
      case DELETE_PUBLIC_FORM_FAL:
      case GET_PUBLIC_FORM_CSV_SUC:
      case GET_PUBLIC_FORM_CSV_FAL:
      case PUT_PUBLIC_FORM_COMPRESS_SUC:
      case PUT_PUBLIC_FORM_COMPRESS_FAL:
        draft.isLoading = false;
        break;

      case GET_PUBLIC_FORM_ALL_SUC:
        draft.isLoading = false;
        draft.isFetchError = false;
        draft.publicFormAll = action.payload.forms;
        draft.publicFormCurrentPage = action.payload.current_page;
        draft.publicFormTotalPages = action.payload.total_pages;
        break;

      case SET_PUBLIC_FORM_CURRENT_PAGE:
        draft.publicFormCurrentPage = action.payload;
        break;

      case SET_PUBLIC_FORM_PER_PAGE:
        draft.publicFormPerPage = action.payload;
        break;

      case SET_PUBLIC_FORM_SEARCH_TERM:
        draft.publicFormSearchTerm = action.payload;
        break;

      case GET_PUBLIC_FORM_PREVIEW_SUC:
        draft.isLoading = false;
        draft.isFetchError = false;
        draft.isFileDeleted = false;
        draft.loaded = true;
        draft.title = action.payload.file_name;
        draft.fileUrl = action.payload.preview_url;
        draft.dlodUrl = action.payload.download_url;
        draft.info = {
          task_status: "waiting",
          signer_name: action.payload.signer_name,
          signer_email: action.payload.signer_email,
        };
        draft.signer_infos = action.payload.signer_infos;
        draft.form_token = action.payload.form_token;
        break;

      case SET_TAB_ACTIVE:
        draft.tabActive = action.payload;
        break;

      case RESET_PUBLIC_FORM:
        Object.keys(initialState).map(
          (key) => (draft[key] = initialState[key]),
        );
        break;

      case UPDATE_PUBLIC_FORM_CONDITION:
        draft.tabActive = action.payload.category;
        draft.publicFormCurrentPage = action.payload.page;
        draft.publicFormPerPage = action.payload.per_page;
        draft.publicFormSearchTerm = action.payload.terms;
        break;

      default:
        break;
    }
  });

export default publicForm;
