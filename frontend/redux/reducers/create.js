import { produce } from "immer";

import {
  SET_IS_TEMPLATE,
  SET_IS_ENVELOPE,
  SET_ENVELOPE_NAME,
  SET_FILE_NAME,
  SET_FILE_LIST,
  SET_FILE_FOCUS,
  SET_FILE_URL,
  SET_FILES,
  SET_TMP_FILES,
  SET_IS_ORDER,
  SET_ASSIGNES_SUCC,
  RESET_CREATE,
  SET_ASSIGNE_FOCUS,
  SET_LABELS,
  SET_STAGES,
  SET_FIELD_GROUPS,
  SET_INFO,
  CHECK_SETTINGS,
  CHECK_SETTINGS_SUC,
  CHECK_SETTINGS_FAL,
  POST_CREATE,
  POST_CREATE_FAL,
  POST_DRAFT,
  POST_DRAFT_SUC,
  POST_DRAFT_FAL,
  POST_DRAFT_TO_CREATE,
  POST_DRAFT_TO_CREATE_SUC,
  POST_DRAFT_TO_CREATE_FAL,
  PUT_DRAFT,
  PUT_DRAFT_SUC,
  PUT_DRAFT_FAL,
  REVERT_DRAFT_SUC,
  CLEAR_STAGES,
  SET_TASK_ID,
  POST_SIGN_AND_SEND,
  POST_SIGN_AND_SEND_FAL,
  POST_TEMPLATE,
  POST_TEMPLATE_SUC,
  POST_TEMPLATE_FAL,
  PUT_TEMPLATE,
  PUT_TEMPLATE_SUC,
  PUT_TEMPLATE_FAL,
  GET_TEMPLATE,
  GET_TEMPLATE_SUC,
  GET_TEMPLATE_FAL,
  SET_CREATE_TYPE,
  SET_ATTACHMENTS_SUC,
  SET_IS_BULK,
  SET_BULK_LIST,
  SET_BULK_LIST_SUC,
  SET_BULK_LIST_FAL,
  SET_CCINFOS,
  POST_BULK,
  POST_BULK_SUC,
  POST_BULK_FAL,
  GET_ASSIGNEE_SYSTEM_CA_LIST,
  GET_ASSIGNEE_SYSTEM_CA_LIST_SUC,
  GET_ASSIGNEE_SYSTEM_CA_LIST_FAL,
  CLEAR_SYSTEM_CA_ACCESS_RIGHT,
  POST_FRONT_DESK_SUC,
  SET_FILE_INSTRUCTIONS,
  SET_THUMBNAIL,
  DELETE_STAGE_SUC,
  SET_REPLACETEMPLATE_SUC,
  SET_IS_PUBLIC_FORM,
  SET_PUBLIC_FORM_DESCRIPTION,
  SET_PUBLIC_FORM_UNPUBLISH_SETTINGS,
  POST_PUBLIC_FORM,
  POST_PUBLIC_FORM_SUC,
  POST_PUBLIC_FORM_FAL,
  GET_PUBLIC_FORM,
  GET_PUBLIC_FORM_SUC,
  GET_PUBLIC_FORM_FAL,
  PUT_PUBLIC_FORM,
  PUT_PUBLIC_FORM_SUC,
  PUT_PUBLIC_FORM_FAL,
} from "../../constants/createTypes";

const initialState = {
  isLoading: false,

  createType: null,
  isEnvelope: false,
  isTemplate: false,
  isTemplateEdit: false,
  taskId: null,
  envelopeId: null,
  templateId: null,
  deviceWidth: 0,
  envelopeName: "untitled",
  fileName: "untitled",
  fileList: [],
  fileFocus: null,
  files: [],
  tmpFiles: [],
  fileUrl: null,
  templatePages: 0,

  forget_remind: false,
  isOrder: false,
  deadline: null, // NOTE: 7, 30, yyyy/mm/dd
  expire_remind: false,
  remind_days_before_expire: null,
  receiver_lang: null,
  message: null,
  completedMessage: null,
  assignes: [],
  assigneesWarnings: {},
  assigneFocus: null,
  templateCode: "",

  stages: [],
  fieldGroups: [],
  isModify: false, // NOTE: draft
  attachments: null,
  labels: null,

  fileInstructions: [],
  thumbnail: null,
  ccInfos: [],

  references: [], // NOTE: for upload
  reference_setting: [], // NOTE: from api
  shareInfo: null, // NOTE: template only
  isBulk: false,
  bulkList: null,
  bulkLength: null,
  bulkError: null, // NOTE: array of error items (including header)

  isAccessSystemCA: false,
  assigneeSystemCAList: [],
  fileInstruction: null,
  isFrontDeskDone: false,

  completedReferences: [],
  msgRequestReceivers: [],
  msgCompletedReceivers: [],

  description: null,
  stopByDeadline: false,
  stopDeadline: null,
  stopByResponseCount: false,
  responseCount: null,
  publicFormSentCount: 0,

  isReplaceTemplate: false,

  formId: null, // NOTE: for publicForm
  isPublicForm: false,
};

const create = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_IS_TEMPLATE:
        draft.isTemplate = action.payload;
        break;

      case SET_IS_ENVELOPE:
        draft.isEnvelope = action.payload;
        break;

      case SET_ENVELOPE_NAME:
        draft.envelopeName = action.payload;
        break;

      case SET_FILE_NAME:
        draft.fileName = action.name;
        break;

      case SET_FILE_LIST:
        draft.fileList = action.payload;
        break;

      case SET_FILE_FOCUS:
        draft.fileFocus = action.payload;
        break;

      case SET_FILE_URL:
        draft.fileUrl = action.payload.url;
        break;

      case SET_FILES:
        draft.files = action.files;
        break;

      case SET_TMP_FILES:
        draft.tmpFiles = action.tmpFiles;
        break;

      case SET_IS_ORDER:
        draft.isOrder = action.isOrder;
        break;
      case SET_ASSIGNES_SUCC:
        draft.assignes = action.assignes;
        draft.assigneesWarnings = action.assigneesWarnings;
        break;

      case SET_ASSIGNE_FOCUS:
        draft.assigneFocus = action.item;
        break;

      case SET_STAGES:
        draft.stages = action.stages;
        break;

      case SET_FIELD_GROUPS:
        draft.fieldGroups = action.payload || [];
        break;

      case SET_INFO:
        Object.keys(action.payload).forEach((key) => {
          draft[key] = action.payload[key];
        });
        break;

      case CHECK_SETTINGS:
      case POST_CREATE:
      case POST_DRAFT:
      case PUT_DRAFT:
      case POST_DRAFT_TO_CREATE:
      case POST_SIGN_AND_SEND:
      case POST_TEMPLATE:
      case GET_TEMPLATE:
      case PUT_TEMPLATE:
      case SET_BULK_LIST:
      case POST_BULK:
      case GET_ASSIGNEE_SYSTEM_CA_LIST:
      case POST_PUBLIC_FORM:
      case GET_PUBLIC_FORM:
      case PUT_PUBLIC_FORM:
        draft.isLoading = true;
        break;

      case CHECK_SETTINGS_SUC:
      case CHECK_SETTINGS_FAL:
      case POST_CREATE_FAL:
      case POST_DRAFT_FAL:
      case PUT_DRAFT_FAL:
      case POST_DRAFT_TO_CREATE_FAL:
      case POST_SIGN_AND_SEND_FAL:
      case POST_TEMPLATE_FAL:
      case GET_TEMPLATE_FAL:
      case PUT_TEMPLATE_FAL:
      case POST_BULK_FAL:
      case GET_ASSIGNEE_SYSTEM_CA_LIST_FAL:
      case POST_PUBLIC_FORM_SUC:
      case POST_PUBLIC_FORM_FAL:
      case GET_PUBLIC_FORM_FAL:
      case PUT_PUBLIC_FORM_SUC:
      case PUT_PUBLIC_FORM_FAL:
        draft.isLoading = false;
        break;

      case POST_DRAFT_SUC:
      case PUT_DRAFT_SUC:
      case POST_DRAFT_TO_CREATE_SUC:
      case POST_TEMPLATE_SUC:
      case PUT_TEMPLATE_SUC:
      case POST_BULK_SUC:
      case RESET_CREATE:
        Object.keys(initialState).forEach((key) => {
          if (
            !action.payload ||
            (action.payload && action.payload.indexOf(key) === -1)
          ) {
            draft[key] = initialState[key];
          }
        });
        break;

      case REVERT_DRAFT_SUC:
        Object.keys(action.payload).forEach((key) => {
          draft[key] = action.payload[key];
        });

        draft.isModify = true;
        break;

      case CLEAR_STAGES:
        draft.stages = [];
        break;

      case SET_TASK_ID:
        draft.taskId = action.payload.taskId;
        break;

      case SET_ATTACHMENTS_SUC:
        draft.attachments = action.payload;
        break;

      case SET_LABELS:
        draft.labels = action.payload;
        break;

      case GET_TEMPLATE_SUC:
        draft.isLoading = false;
        draft.isTemplate = action.payload.isTemplateEdit;
        draft.isTemplateEdit = action.payload.isTemplateEdit;
        draft.templateId = action.payload.templateId;
        draft.fileUrl = action.payload.fileUrl;
        draft.fileName = action.payload.fileName;
        draft.isOrder = action.payload.isOrder;
        draft.assignes = action.payload.assignes;
        draft.stages = action.payload.stages;
        draft.attachments = action.payload.attachments;
        draft.labels = action.payload.labels;
        draft.thumbnail = action.payload.thumbnail;
        draft.templateCode = action.payload.templateCode;
        draft.templatePages = action.payload.templatePages;
        draft.files = action.payload.files;
        draft.tmpFiles = action.payload.tmpFiles;
        if (action.payload.shareInfo) {
          draft.shareInfo = action.payload.shareInfo;
        }
        if (action.payload.fieldGroups) {
          draft.fieldGroups = action.payload.fieldGroups;
        }

        break;

      case SET_CREATE_TYPE:
        draft.createType = action.payload;
        break;

      case SET_IS_BULK:
        draft.isBulk = action.payload;
        break;

      case SET_BULK_LIST_SUC:
        draft.isLoading = false;
        draft.bulkError = null;
        draft.bulkList = action.payload;
        break;

      case SET_BULK_LIST_FAL:
        draft.isLoading = false;
        draft.bulkLength = action.payload.length;
        draft.bulkList = null;
        draft.bulkError = action.payload.errors;
        break;

      case GET_ASSIGNEE_SYSTEM_CA_LIST_SUC:
        draft.isLoading = false;
        draft.isAccessSystemCA = action.payload.isAccess;
        draft.assigneeSystemCAList = action.payload.CAList;
        break;

      case CLEAR_SYSTEM_CA_ACCESS_RIGHT:
        draft.isAccessSystemCA = initialState.isAccessSystemCA;
        draft.assigneeSystemCAList = initialState.assigneeSystemCAList;
        break;

      case POST_FRONT_DESK_SUC:
        draft.isFrontDeskDone = true;
        break;

      case SET_FILE_INSTRUCTIONS:
        draft.fileInstructions = action.payload;
        break;

      case SET_THUMBNAIL:
        draft.thumbnail = action.payload;
        break;

      case SET_CCINFOS:
        draft.ccInfos = action.payload;
        break;

      case DELETE_STAGE_SUC:
        draft.stages = action.payload;
        break;

      case SET_IS_PUBLIC_FORM:
        draft.isPublicForm = action.payload;
        break;

      case SET_PUBLIC_FORM_DESCRIPTION:
        draft.description = action.payload;
        break;

      case SET_PUBLIC_FORM_UNPUBLISH_SETTINGS:
        break;

      case GET_PUBLIC_FORM_SUC:
        draft.isLoading = false;
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;

      case SET_REPLACETEMPLATE_SUC: {
        const { tmpFiles, fileUrl } = action.payload;
        draft.isReplaceTemplate = true;
        draft.files = tmpFiles;
        draft.fileUrl = fileUrl;
        break;
      }

      default:
        break;
    }
  });

export default create;
