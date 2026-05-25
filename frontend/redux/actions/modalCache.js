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

export const setSigningGroupParams = (data) => {
  return { type: SET_SIGNING_GROUP_PARAMS, payload: data };
};

export const clearSigningGroupParams = () => {
  return { type: CLEAR_SIGNING_GROUP_PARAMS };
};

export const setSignerSettingsParams = (data) => {
  return { type: SET_SIGNER_SETTINGS_PARAMS, payload: data };
};

export const clearSignerSettingsParams = () => {
  return { type: CLEAR_SIGNER_SETTINGS_PARAMS };
};

export const setSigningGroupImportParams = (data) => {
  return { type: SET_SIGNING_GROUP_IMPORT_PARAMS, payload: data };
};

export const clearSigningGroupImportParams = () => {
  return { type: CLEAR_SIGNING_GROUP_IMPORT_PARAMS };
};

export const setAutoTasksParams = (data) => {
  return { type: SET_AUTO_TASKS_PARAMS, payload: data };
};

export const clearAutoTasksParams = () => {
  return { type: CLEAR_AUTO_TASKS_PARAMS };
};

export const setSelectTemplatesParams = (data) => {
  return { type: SET_SELECTION_TEMPLATES_PARAMS, payload: data };
};

export const clearSelectTemplatesParams = () => {
  return { type: CLEAR_SELECTION_TEMPLATES_PARAMS };
};

export const setSelectWatermarksParams = (data) => {
  return { type: SET_SELECTION_WATERMARKS_PARAMS, payload: data };
};

export const clearSelectWatermarksParams = () => {
  return { type: CLEAR_SELECTION_WATERMARKS_PARAMS };
};

export const setGroupEditParams = (data) => {
  return { type: SET_GROUP_EDIT_PARAMS, payload: data };
};
export const clearGroupEditParams = () => {
  return { type: CLEAR_GROUP_EDIT_PARAMS };
};
export const setReplaceDocParams = (data) => {
  return { type: SET_REPLACE_DOC_PARAMS, payload: data };
};
export const clearReplaceDocParams = () => {
  return { type: CLEAR_REPLACE_DOC_PARAMS };
};

export const setModifyDocParams = (data) => {
  return { type: SET_MODIFY_DOC_PARAMS, payload: data };
};
export const clearModifyDocParams = () => {
  return { type: CLEAR_MODIFY_DOC_PARAMS };
};
export const setIsFieldLost = (data) => {
  return { type: SET_IS_FIELD_LOST, payload: data };
};
export const setFileWarning = (data) => {
  return { type: SET_MODIFY_FILE_WARNING, payload: data };
};
export const setWatermarkInfo = (data) => {
  return { type: SET_WATERMARK_INFO, payload: data };
};

export const setMidVerifyFormData = (data) => {
  return { type: SET_MID_VERIFY_FORM_DATA, payload: data };
};
export const clearMidVerifyFormData = () => {
  return { type: CLEAR_MID_VERIFY_FORM_DATA };
};
