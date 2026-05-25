import * as types from "../../constants/signTypes";

export const getSigns = (data) => {
  return { type: types.GET_SIGNS, data };
};

export const setSigns = (signs) => {
  return { type: types.SET_SIGNS, payload: { signs } };
};

export const saveSign = (data) => {
  return { type: types.SAVE_SIGN, data };
};

export const createStampSign = (data) => {
  return { type: types.CREATE_STAMP_SIGN, data };
};

export const saveSignGuest = (data) => {
  return { type: types.SAVE_SIGN_GUEST, data };
};

export const clearSignGuest = () => {
  return { type: types.CLEAR_SIGN_GUEST };
};

export const deleteSign = (data) => {
  return { type: types.DELETE_SIGN, payload: data };
};

export const getSignTask = (data) => {
  return { type: types.GET_SIGN_TASK, data };
};

export const setFileUrl = (fileUrl) => {
  return { type: types.SET_FILE_URL, payload: fileUrl };
};

export const getPreviewShareSignTask = (data) => {
  return { type: types.GET_PREVIEW_SHARE_SIGN_TASK, data };
};

export const deleteSignTask = (data) => {
  return { type: types.DELETE_SIGN_TASK, data };
};

export const putSignTask = (payload) => {
  return { type: types.PUT_SIGN_TASK, payload };
};

export const getOverall = () => {
  return { type: types.GET_OVERALL };
};

export const getTasks = (data) => {
  return { type: types.GET_TASKS, payload: data };
};

export const getPublicFormTasks = (data) => {
  return { type: types.GET_PUBLIC_FORM_TASKS, payload: data };
};

export const getEmailOut = (task_id) => {
  return { type: types.GET_EMAIL_OUT, task_id };
};

export const getDownloadFile = (data) => {
  return { type: types.GET_DOWNLOAD_FILE, data };
};

export const getAuditTrail = (data) => {
  return { type: types.GET_AUDIT_TRAIL, data };
};

export const getPreviewShareLink = (data) => {
  return { type: types.GET_PREVIEW_SHARE_LINK, data };
};

export const getTaskFile = (data) => {
  return { type: types.GET_TASK_FILE, data };
};

export const getAuditTrailHistory = (data) => {
  return { type: types.GET_AUDIT_TRAIL_HISTORY, data };
};

export const delAuditTrailHistory = () => {
  return { type: types.DEL_AUDIT_TRAIL_HISTORY };
};

export const updateAppliedSigns = (data) => {
  return { type: types.UPDATE_APPLIED_SIGNS, data };
};

export const setMode = (mode) => {
  return { type: types.SET_MODE, payload: mode };
};

export const setFocus = (focus) => {
  return { type: types.SET_FOCUS, payload: focus };
};

export const setFilter = (key) => {
  return { type: types.SET_FILTER, payload: key };
};

export const setDisplay = (type) => {
  return { type: types.SET_DISPLAY, payload: type };
};

export const setFileFocus = (payload) => {
  return { type: types.SET_FILE_FOCUS, payload };
};

export const setPageInvolvers = (payload) => {
  return { type: types.SET_PAGE_INVOLVERS, payload };
};

export const putFileName = (data) => {
  return { type: types.PUT_FILE_NAME, data };
};

export const postSetup = (data) => {
  return { type: types.POST_SETUP, data };
};

export const postOtpResend = (data) => {
  return { type: types.POST_OTP_RESEND, data };
};

export const postFastSigningConsent = (data) => {
  return { type: types.POST_FAST_SIGNING_CONSENT, data };
};

export const postInviteSignResend = (data) => {
  return { type: types.POST_INVITE_SIGN_RESEND, data };
};

export const setTaskUuid = (uuid) => {
  return { type: types.SET_TASK_UUID, payload: { uuid } };
};

export const postNotifySender = (data) => {
  return { type: types.POST_NOTIFY_SENDER, data };
};

export const postChangeOwner = (data) => {
  return { type: types.POST_CHANGE_OWNER, data };
};

export const putChangeSigner = (data) => {
  return { type: types.POST_CHANGE_SIGNER, data };
};

export const setAttachmentsUploaded = (data) => {
  return { type: types.SET_ATTACHMENTS_UPLOADED, payload: data };
};

export const resetSign = () => {
  return { type: types.RESET_SIGN };
};

export const changeFileName = (data) => {
  return { type: types.CHANGE_FILE_NAME, data };
};

export const declineToSign = (data) => {
  return { type: types.POST_DECLINE, data };
};

export const setStagesUpdate = (data) => {
  return { type: types.SET_STAGES_UPDATE, payload: data };
};
export const postKioskVerify = (data) => {
  return { type: types.POST_KIOSK_VERIFY, data };
};

export const putKioskSign = (data) => {
  return { type: types.PUT_KIOSK_SIGN, data };
};

export const fetchDraft = (data) => {
  return { type: types.FETCH_DRAFT, data };
};

export const downloadAttachment = (data) => {
  return { type: types.DOWNLOAD_ATTACHMENT, data };
};

export const getGraAuthorizeStatus = (data) => {
  return { type: types.GET_GRA_AUTHORIZE_STATUS, data };
};

export const postReissueTask = (data) => {
  return { type: types.POST_REISSUETASK, data };
};

export const postDuplicateSignTask = (data) => {
  return { type: types.POST_DUPLLICATE_SIGN_TASK, data };
};

export const postSaveAsTemplate = (payload) => {
  return { type: types.POST_SAVE_AS_TEMPLATE, payload };
};

export const updateAppliedFieldAction = (data) => {
  return { type: types.UPDATE_APPLIED_FIELD_ACTION, payload: data };
};

export const updateAppliedFieldGroupAction = (data) => {
  return { type: types.UPDATE_APPLIED_FIELD_GROUP_ACTION, payload: data };
};

export const postCheck = (data) => {
  return { type: types.POST_CHECK, data };
};

export const postReviewDone = (data) => {
  return { type: types.POST_REVIEW_DONE, data };
};

export const setPhotoSignatures = (data) => {
  return { type: types.SET_PHOTO_SIGNATURES, payload: data };
};

export const setIsPublicForm = (payload) => {
  return { type: types.SET_IS_PUBLIC_FORM, payload };
};

export const readPublicForm = (data) => {
  return { type: types.READ_PUBLIC_FORM, data };
};

export const putPublicFormSign = () => {
  return { type: types.PUT_PUBLIC_FORM_SIGN };
};
