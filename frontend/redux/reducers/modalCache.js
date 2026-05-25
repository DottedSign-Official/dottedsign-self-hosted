import { produce } from "immer";
import {
  SET_SIGNER_SETTINGS_PARAMS,
  CLEAR_SIGNER_SETTINGS_PARAMS,
  SET_SIGNING_GROUP_PARAMS,
  CLEAR_SIGNING_GROUP_PARAMS,
  SET_SIGNING_GROUP_IMPORT_PARAMS,
  CLEAR_SIGNING_GROUP_IMPORT_PARAMS,
  SET_AUTO_TASKS_PARAMS,
  CLEAR_AUTO_TASKS_PARAMS,
  SET_SELECTION_TEMPLATES_PARAMS,
  CLEAR_SELECTION_TEMPLATES_PARAMS,
  SET_SELECTION_WATERMARKS_PARAMS,
  CLEAR_SELECTION_WATERMARKS_PARAMS,
  SET_GROUP_EDIT_PARAMS,
  CLEAR_GROUP_EDIT_PARAMS,
  SET_REPLACE_DOC_PARAMS,
  CLEAR_REPLACE_DOC_PARAMS,
  SET_MODIFY_DOC_PARAMS,
  CLEAR_MODIFY_DOC_PARAMS,
  SET_IS_FIELD_LOST,
  SET_MODIFY_FILE_WARNING,
  SET_WATERMARK_INFO,
  SET_MID_VERIFY_FORM_DATA,
  CLEAR_MID_VERIFY_FORM_DATA,
} from "../../constants/modalCacheTypes";

const fileTransformApi = (file) => {
  return {
    ...file,
    name: file.name || file.file_name || file.extract_file_name,
    uid: file.uid || file.file_object_id,
    pages: file.pages || file.page_count,
  };
};

// NOTE: cache for uis.
const initialState = {
  // NOTE: signer settings
  signerSettingsPosition: null,
  signerSettingsUid: null,
  signerSettingsWarningSystemCA: null,
  signerSettingsSigners: null,

  // NOTE: signing group
  isSigningGroupCreate: null,
  isSigningGroupReadOnly: null,
  signingGroupId: null,
  signingGroupName: null,
  signingGroupDesc: null,
  signingGroupIsOrder: null,
  signingGroupSigners: null,

  // NOTE: signing group import
  signingGroupImportShouldHint: null,
  signingGroupImportGroups: null,
  signingGroupImportPages: null,
  signingGroupImportPage: null,
  // NOTE: auto tasks
  isAutoTasksCreate: null,
  autoTasksFocusItem: null,
  // NOTE: selection templates
  isSelectMultiTemplates: null,
  templatesFocus: null,
  onTemplatesConfirm: null,
  onTemplatesCancel: null,
  // NOTE: selection watermark
  fileBased: null,
  watermarkFocus: null,
  onWatermarkSelectConfirm: null,
  watermarkInfo: null,
  // NOTE: group edit
  groupEditIsAdd: null,
  groupEditLabel: null,
  groupEditOrder: null,
  // NOTE: replace document
  replaceFile: null,
  replaceFileUploaded: null,
  // NOTE: modify document
  originFiles: null,
  modifiedFiles: null,
  isFieldLost: false,
  fileWarning: null,
  docData: null, // NOTE: type: typeof initialState of create
  // NOTE: mid verify
  phone: null,
  operator: null,
  nationalId: null,
  nationalIdApplyYear: null,
  nationalIdApplyMonth: null,
  nationalIdApplyDay: null,
  nationalIdIssueSiteId: null,
  nationalIdApplyCode: null,
};

const modalCache = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SIGNING_GROUP_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;

      case CLEAR_SIGNING_GROUP_PARAMS:
        draft.isSigningGroupCreate = null;
        draft.isSigningGroupReadOnly = null;
        draft.signingGroupId = null;
        draft.signingGroupName = null;
        draft.signingGroupDesc = null;
        draft.signingGroupIsOrder = null;
        draft.signingGroupSigners = null;
        break;

      case SET_SIGNER_SETTINGS_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_SIGNER_SETTINGS_PARAMS:
        draft.signerSettingsPosition = null;
        draft.signerSettingsUid = null;
        draft.signerSettingsWarningSystemCA = null;
        draft.signerSettingsSigners = null;
        draft.signerSettingsFunc = null;
        break;
      case SET_SIGNING_GROUP_IMPORT_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_SIGNING_GROUP_IMPORT_PARAMS:
        draft.signingGroupImportShouldHint = null;
        draft.signingGroupImportGroups = null;
        draft.signingGroupImportPages = null;
        draft.signingGroupImportPage = null;
        break;
      case SET_AUTO_TASKS_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_AUTO_TASKS_PARAMS:
        draft.isAutoTasksCreate = null;
        draft.autoTasksFocusItem = null;
        break;
      case SET_SELECTION_TEMPLATES_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_SELECTION_TEMPLATES_PARAMS:
        draft.isSelectMultiTemplates = null;
        draft.templatesFocus = null;
        draft.onTemplatesConfirm = null;
        draft.onTemplatesCancel = null;
        break;
      case SET_SELECTION_WATERMARKS_PARAMS:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_SELECTION_WATERMARKS_PARAMS:
        draft.fileBased = null;
        draft.watermarkFocus = null;
        draft.onWatermarkSelectConfirm = null;
        break;
      case SET_GROUP_EDIT_PARAMS:
        draft.groupEditIsAdd = action.payload.isAdd;
        draft.groupEditLabel = action.payload.label;
        draft.groupEditOrder = action.payload.order;
        break;
      case CLEAR_GROUP_EDIT_PARAMS:
        draft.groupEditIsAdd = null;
        draft.groupEditLabel = null;
        draft.groupEditOrder = null;
        break;
      case SET_REPLACE_DOC_PARAMS:
        draft.replaceFile = action.payload.replaceFile;
        draft.replaceFileUploaded = action.payload.replaceFileUploaded;
        break;
      case CLEAR_REPLACE_DOC_PARAMS:
        draft.replaceFile = null;
        draft.replaceFileUploaded = null;
        break;
      case SET_MODIFY_DOC_PARAMS:
        draft.originFiles =
          action.payload?.originFiles?.map((oriFile) =>
            fileTransformApi(oriFile),
          ) || draft.originFiles;
        draft.modifiedFiles =
          action.payload?.modifiedFiles?.map((modifiedFile) =>
            fileTransformApi(modifiedFile),
          ) || draft.modifiedFiles;
        draft.docData = action.payload?.docData || draft.docData;
        break;
      case CLEAR_MODIFY_DOC_PARAMS:
        draft.originFiles = null;
        draft.modifiedFiles = null;
        draft.isFieldLost = false;
        draft.fileWarning = null;
        draft.docData = null;
        break;
      case SET_IS_FIELD_LOST:
        draft.isFieldLost = action.payload;
        break;
      case SET_MODIFY_FILE_WARNING:
        draft.fileWarning = action.payload;
        break;
      case SET_WATERMARK_INFO:
        draft.watermarkInfo = action.payload;
        break;

      case SET_MID_VERIFY_FORM_DATA:
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;
      case CLEAR_MID_VERIFY_FORM_DATA:
        draft.phone = null;
        draft.operator = null;
        draft.nationalId = null;
        draft.nationalIdApplyYear = null;
        draft.nationalIdApplyMonth = null;
        draft.nationalIdApplyDay = null;
        draft.nationalIdIssueSiteId = null;
        draft.nationalIdApplyCode = null;
        break;

      default:
        break;
    }
  });

export default modalCache;
