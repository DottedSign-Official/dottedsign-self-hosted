import * as types from "../../constants/createTypes";

export const setIsTemplate = (data) => {
  return { type: types.SET_IS_TEMPLATE, payload: data };
};

export const setIsEnvelope = (payload) => {
  return { type: types.SET_IS_ENVELOPE, payload };
};

export const setEnvelopeName = (payload) => {
  return { type: types.SET_ENVELOPE_NAME, payload };
};

export const setFileName = (name) => {
  return { type: types.SET_FILE_NAME, name };
};

export const setFileList = (fileList) => {
  return { type: types.SET_FILE_LIST, payload: fileList };
};

export const setFileFocus = (payload) => {
  return { type: types.SET_FILE_FOCUS, payload };
};

export const setFiles = (files) => {
  return { type: types.SET_FILES, files };
};

export const setTmpFiles = (tmpFiles) => {
  return { type: types.SET_TMP_FILES, tmpFiles };
};

export const setFileUrl = (fileUrl) => {
  return { type: types.SET_FILE_URL, payload: fileUrl };
};

export const setIsOrder = (isOrder) => {
  return { type: types.SET_IS_ORDER, isOrder };
};

export const setAssignes = (data) => {
  // NOTE: assignes, stages
  return { type: types.SET_ASSIGNES, data };
};

export const setAttachments = (data) => {
  return { type: types.SET_ATTACHMENTS, data };
};

export const setLabels = (data) => {
  return { type: types.SET_LABELS, payload: data };
};

export const checkSettings = (data) => {
  return { type: types.CHECK_SETTINGS, data };
};

export const setAssigneFocus = (item) => {
  return { type: types.SET_ASSIGNE_FOCUS, item };
};

export const setStages = (stages) => {
  return { type: types.SET_STAGES, stages };
};

export const setFieldGroups = (data) => {
  return { type: types.SET_FIELD_GROUPS, payload: data };
};

export const setInfo = (info) => {
  return { type: types.SET_INFO, payload: info };
};

export const postDraft = (data) => {
  return { type: types.POST_DRAFT, data };
};

export const putDraft = (data) => {
  return { type: types.PUT_DRAFT, data };
};

export const postDraftToCreate = (data) => {
  return { type: types.POST_DRAFT_TO_CREATE, data };
};

export const postCreate = (data) => {
  return { type: types.POST_CREATE, data };
};

export const postSignAndSend = (data) => {
  return { type: types.POST_SIGN_AND_SEND, data };
};

export const postTemplate = (data) => {
  return { type: types.POST_TEMPLATE, data };
};

export const putTemplate = (data) => {
  return { type: types.PUT_TEMPLATE, data };
};

export const getTemplate = (data) => {
  return { type: types.GET_TEMPLATE, data };
};

export const resetCreate = (data) => {
  return { type: types.RESET_CREATE, payload: data };
};

export const setIsBulk = (data) => {
  return { type: types.SET_IS_BULK, payload: data };
};

export const setBulkList = (data) => {
  return { type: types.SET_BULK_LIST, data };
};

export const postBulk = () => {
  return { type: types.POST_BULK };
};

export const getAssigneeSystemCAList = (data) => {
  return { type: types.GET_ASSIGNEE_SYSTEM_CA_LIST, payload: data };
};

export const clearSystemCAAccessRight = () => {
  return { type: types.CLEAR_SYSTEM_CA_ACCESS_RIGHT };
};
export const postKioskCreate = (data) => {
  return { type: types.POST_KIOSK_CREATE, data };
};

export const postFrontDesk = () => {
  return { type: types.POST_FRONT_DESK };
};

export const setFileInstructions = (data) => {
  return { type: types.SET_FILE_INSTRUCTIONS, payload: data };
};

export const setThumbnail = (data) => {
  return { type: types.SET_THUMBNAIL, payload: data };
};

export const setCCInfos = (data) => {
  return { type: types.SET_CCINFOS, payload: data };
};

export const setDescription = (data) => {
  return { type: types.SET_PUBLIC_FORM_DESCRIPTION, payload: data };
};

export const setReplaceTemplate = () => {
  return { type: types.SET_REPLACETEMPLATE };
};

export const setIsPublicForm = (payload) => {
  return { type: types.SET_IS_PUBLIC_FORM, payload };
};

export const setUnpublishSettings = (data) => {
  return { type: types.SET_PUBLIC_FORM_UNPUBLISH_SETTINGS, payload: data };
};

export const postPublicForm = (data) => {
  return { type: types.POST_PUBLIC_FORM, data };
};

export const getPublicForm = (data) => {
  return { type: types.GET_PUBLIC_FORM, data };
};

export const putPublicForm = (data) => {
  return { type: types.PUT_PUBLIC_FORM, data };
};
