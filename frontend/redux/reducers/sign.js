import { produce } from "immer";

import {
  GET_SIGNS,
  GET_SIGNS_SUC,
  GET_SIGNS_FAL,
  GET_SIGN_TASK_OTP_FAL,
  SET_SIGNS,
  SET_SIGNER_EMAIL,
  DELETE_SIGN,
  DELETE_SIGN_SUC,
  DELETE_SIGN_FAL,
  CREATE_SIGN,
  SAVE_SIGN,
  SAVE_SIGN_SUC,
  SAVE_SIGN_FAL,
  SAVE_SIGN_GUEST,
  SAVE_SIGN_GUEST_SUC,
  SAVE_SIGN_GUEST_FAL,
  CLEAR_SIGN_GUEST,
  GET_AUDIT_TRAIL_HISTORY,
  GET_AUDIT_TRAIL_HISTORY_SUC,
  GET_AUDIT_TRAIL_HISTORY_FAL,
  DEL_AUDIT_TRAIL_HISTORY,
  GET_SIGN_TASK,
  GET_SIGN_TASK_SUC,
  GET_SIGN_TASK_FAL,
  GET_SIGN_TASK_STOP,
  DELETE_SIGN_TASK,
  DELETE_SIGN_TASK_SUC,
  DELETE_SIGN_TASK_FAL,
  UPDATE_APPLIED_SIGNS_SUC,
  PUT_SIGN_TASK,
  PUT_SIGN_TASK_SUC,
  PUT_SIGN_TASK_FAL,
  PUT_SIGN_TASK_OTP_FAL,
  GET_TASKS,
  GET_TASKS_SUC,
  GET_TASKS_FAL,
  GET_PUBLIC_FORM_TASKS,
  GET_PUBLIC_FORM_TASKS_SUC,
  SET_MODE,
  SET_FOCUS,
  SET_FILTER,
  SET_DISPLAY,
  SET_FILE_FOCUS,
  SET_PAGE_INVOLVERS,
  SET_ALL_FILES_INVOLVERS,
  PUT_FILE_NAME,
  PUT_FILE_NAME_SUC,
  PUT_FILE_NAME_FAL,
  POST_SETUP,
  POST_SETUP_SUC,
  POST_SETUP_FAL,
  POST_FAST_SIGNING_CONSENT,
  POST_FAST_SIGNING_CONSENT_SUC,
  POST_FAST_SIGNING_CONSENT_FAL,
  POST_INVITE_SIGN_RESEND,
  POST_INVITE_SIGN_RESEND_SUC,
  POST_INVITE_SIGN_RESEND_FAL,
  SET_TASK_UUID,
  SET_ATTACHMENTS_UPLOADED,
  POST_ATTACHMENTS_UPLOAD_START,
  POST_NOTIFY_SENDER_BEGIN,
  POST_NOTIFY_SENDER_SUC,
  POST_NOTIFY_SENDER_FAL,
  POST_CHANGE_OWNER,
  POST_CHANGE_OWNER_SUC,
  POST_CHANGE_OWNER_FAL,
  RESET_SIGN,
  RESET_SIGN_ONLY,
  POST_DECLINE,
  POST_DECLINE_SUC,
  POST_DECLINE_FAL,
  POST_CHANGE_SIGNER_SUC,
  SET_STAGES_UPDATE,
  SET_TASK_ID,
  POST_KIOSK_VERIFY,
  POST_KIOSK_VERIFY_SUC,
  POST_KIOSK_VERIFY_FAL,
  PUT_KIOSK_SIGN,
  PUT_KIOSK_SIGN_SUC,
  PUT_KIOSK_SIGN_FAL,
  DOWNLOAD_ATTACHMENT,
  DOWNLOAD_ATTACHMENT_SUC,
  DOWNLOAD_ATTACHMENT_FAL,
  GET_GRA_AUTHORIZE_STATUS,
  GET_GRA_AUTHORIZE_STATUS_SUC,
  GET_GRA_AUTHORIZE_STATUS_FAL,
  POST_SAVE_AS_TEMPLATE,
  POST_SAVE_AS_TEMPLATE_SUC,
  POST_SAVE_AS_TEMPLATE_FAL,
  SET_FILE_URL,
  SAVE_IDENTITY_CHECK_TOKEN,
  POST_CHECK,
  POST_CHECK_SUC,
  POST_CHECK_FAL,
  POST_REVIEW_DONE,
  POST_REVIEW_DONE_SUC,
  POST_REVIEW_DONE_FAL,
  SET_PHOTO_SIGNATURES,
  SET_IS_PUBLIC_FORM,
  SET_IS_PUBLIC_FORM_SIGNING,
  GET_PUBLIC_FORM_SIGN_SUC,
  READ_PUBLIC_FORM,
  READ_PUBLIC_FORM_SUC,
  READ_PUBLIC_FORM_FAL,
  PUT_PUBLIC_FORM_SIGN,
  PUT_PUBLIC_FORM_SIGN_SUC,
  PUT_PUBLIC_FORM_SIGN_FAL,
} from "../../constants/signTypes";

const initialState = {
  code: null,
  isLoading: false,
  isExpired: false,
  owner: null,
  owner_email: null,
  isMyTurn: false,
  pageInvolvers: {},
  allFilesInvolvers: {},
  involved: [],
  signerEmail: null,
  signs: null, // NOTE: signatures, don"t clear
  stamps: null,
  task_id: null,
  envelope_id: null,
  fileList: [],
  fileFocus: null,
  fileUrl: null,
  stage_id: null,
  appliedSigns: [],
  hint: null,
  resultType: null,
  auditTrail: null,
  taskBlocks: null,
  attachments: null,
  download_link: null,
  complete_link: null,
  setup: null,
  isOtpFail: false,
  taskUuid: null,
  isFastSigning: null,
  isFastSigningDone: false,
  isSigningDone: false,
  identityVerifyToken: null,
  guestSignature: null,
  stagesUpdate: null,
  reviewFields: null,
  reviewedAttachments: null,

  isLoadingAllTasks: false,
  display: "files",
  focus: "waiting_for_me",
  mode: "grid",
  filter: null,
  filename: null,
  isExpire: false, // NOTE: for filter
  taskSummary: {},
  allTasks: null,
  allTasksFocus: null,
  focusPageAll: 1,
  focusPage: 1,

  isEnvelope: false,

  reference_setting: null,

  hideDropdownMenu: false,

  stage_infos: null,
  decline_enable: false,
  forward_enable: false,
  notify_owner_enable: false,
  declineReasons: [],
  navbar: {
    title: "",
    expiredReminder: {
      isVisible: false,
      days: 0,
    },
    moreMenu: {
      changeSigner: {
        isVisible: false,
        data: {},
      },
      notifyOwner: {
        isVisible: false,
        data: {},
      },
      previewShareLink: {
        isVisible: false,
        data: {},
      },
      manageTags: {
        isVisible: false,
        data: {},
      },
      declineToSign: {
        isVisible: false,
        data: {},
      },
    },
    download: {
      isVisible: false,
      data: {},
    },
    signSteps: {
      isVisible: false,
      data: {},
    },
    review: {
      isVisible: false,
      data: {},
    },
    taskInfo: {
      isVisible: false,
    },
    menu: {
      message: {
        isVisible: false,
        data: {},
      },
      downloadPDF: {
        isVisible: false,
        disabled: false,
        data: {},
      },
      redirect: {
        isVisible: true,
        link: "/tasks",
      },
    },
    rollback: {
      isVisible: false,
      data: {},
    },
  },
  pdf: null,
  viewable_attachments: null,
  finishedAttachments: [],
  reissueStatus: null,
  ccInfos: [],
  identity_verify_token: null,
  photoSignatures: [], // NOTE: array of objects with { url, id, email }

  publicFormUuid: null,
  isPublicForm: false,
};

const sign = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_TASKS:
      case GET_PUBLIC_FORM_TASKS:
        draft.isLoadingAllTasks = true;
        break;

      case GET_TASKS_SUC:
        draft.isLoadingAllTasks = false;
        draft.focusPageAll = action.payload.focusPageAll;
        draft.focusPage = action.payload.focusPage;
        draft.allTasksFocus = action.payload.allTasksFocus;
        draft.taskSummary = action.payload.taskSummary || {};
        break;
      case GET_TASKS_FAL:
        draft.isLoadingAllTasks = false;
        break;

      case GET_PUBLIC_FORM_TASKS_SUC:
        break;

      case GET_SIGN_TASK_SUC:
        draft.isLoading = false;
        Object.keys(action.payload).forEach((key) => {
          // NOTE: signer_email for quick-sign
          if (
            key === "signs" ||
            key === "signerEmail" ||
            key === "taskUuid" ||
            key === "identity_verify_token"
          ) {
            return;
          }
          draft[key] = action.payload[key];
        });
        break;
      case GET_SIGN_TASK_FAL:
        draft.isLoading = false;
        draft.hint = action.payload.hint;
        draft.resultType = action.payload.resultType;
        draft.warning = action.payload.warning;
        draft.viewable_attachments = action.payload.viewable_attachments;
        break;

      case GET_SIGNS_SUC:
      case GET_SIGNS_FAL:
        draft.isLoading = false;
        break;
      case SET_SIGNS:
        if (action.payload.category === "stamp") {
          draft.stamps = action.payload.signs;
        } else {
          draft.signs = action.payload.signs;
        }
        break;

      case GET_SIGNS:
      case CREATE_SIGN:
      case SAVE_SIGN:
      case DELETE_SIGN:
      case PUT_FILE_NAME:
      case POST_SETUP:
      case POST_FAST_SIGNING_CONSENT:
      case POST_INVITE_SIGN_RESEND:
      case POST_ATTACHMENTS_UPLOAD_START:
      case POST_NOTIFY_SENDER_BEGIN:
      case POST_CHANGE_OWNER:
      case DELETE_SIGN_TASK:
      case POST_DECLINE:
      case POST_KIOSK_VERIFY:
      case PUT_KIOSK_SIGN:
      case POST_SAVE_AS_TEMPLATE:
      case DOWNLOAD_ATTACHMENT:
      case GET_GRA_AUTHORIZE_STATUS:
      case POST_CHECK:
      case POST_REVIEW_DONE:
      case PUT_PUBLIC_FORM_SIGN:
      case READ_PUBLIC_FORM:
      case SAVE_SIGN_GUEST:
      case GET_AUDIT_TRAIL_HISTORY:
        draft.isLoading = true;
        break;

      case PUT_SIGN_TASK_SUC:
      case POST_DECLINE_SUC:
      case POST_CHANGE_SIGNER_SUC:
        draft.decline_enable = false;
        draft.forward_enable = false;
        draft.notify_owner_enable = false;
        draft.isLoading = false;
        break;

      case SAVE_SIGN_SUC:
      case SAVE_SIGN_FAL:
      case DELETE_SIGN_SUC:
      case DELETE_SIGN_FAL:
      case PUT_FILE_NAME_SUC:
      case PUT_FILE_NAME_FAL:
      case POST_SETUP_FAL:
      case POST_FAST_SIGNING_CONSENT_SUC:
      case POST_FAST_SIGNING_CONSENT_FAL:
      case POST_INVITE_SIGN_RESEND_SUC:
      case POST_INVITE_SIGN_RESEND_FAL:
      case POST_NOTIFY_SENDER_SUC:
      case POST_NOTIFY_SENDER_FAL:
      case POST_CHANGE_OWNER_SUC:
      case POST_CHANGE_OWNER_FAL:
        draft.isLoading = false;
        break;

      case DELETE_SIGN_TASK_SUC:
        draft.isLoading = false;
        draft.isSigningDone = action.payload.isSigningDone;
        break;

      case DELETE_SIGN_TASK_FAL:
      case POST_DECLINE_FAL:
      case GET_SIGN_TASK_STOP:
      case POST_KIOSK_VERIFY_FAL:
      case PUT_KIOSK_SIGN_SUC:
      case PUT_KIOSK_SIGN_FAL:
      case DOWNLOAD_ATTACHMENT_SUC:
      case DOWNLOAD_ATTACHMENT_FAL:
      case GET_GRA_AUTHORIZE_STATUS_SUC:
      case GET_GRA_AUTHORIZE_STATUS_FAL:
        draft.isLoading = false;
        break;

      case POST_CHECK_SUC:
        draft.isLoading = false;
        draft.isSigningDone = action.payload.isSigningDone;
        break;

      case POST_CHECK_FAL:
      case READ_PUBLIC_FORM_FAL:
      case PUT_PUBLIC_FORM_SIGN_SUC:
      case PUT_PUBLIC_FORM_SIGN_FAL:
      case POST_REVIEW_DONE_SUC:
      case POST_REVIEW_DONE_FAL:
        draft.isLoading = false;
        break;

      case POST_SETUP_SUC:
        draft.isLoading = false;
        break;

      case SAVE_SIGN_GUEST_SUC:
        draft.isLoading = false;
        draft.guestSignature = action.payload.guestSignature;
        break;
      case SAVE_SIGN_GUEST_FAL:
        draft.isLoading = false;
        break;
      case CLEAR_SIGN_GUEST:
        draft.guestSignature = null;
        break;

      case GET_AUDIT_TRAIL_HISTORY_SUC:
        draft.isLoading = false;
        draft.auditTrail = action.payload;
        break;
      case GET_AUDIT_TRAIL_HISTORY_FAL:
        draft.isLoading = false;
        break;
      case DEL_AUDIT_TRAIL_HISTORY:
        draft.auditTrail = null;
        break;

      case SET_SIGNER_EMAIL:
        draft.signerEmail = action.payload.signer_email;
        break;

      case SET_MODE:
        draft.mode = action.payload;
        break;
      case SET_FOCUS:
        draft.focus = action.payload;
        break;
      case SET_FILTER:
        draft.filter = action.payload;
        break;

      case SET_DISPLAY:
        draft.display = action.payload;
        break;

      case SET_FILE_URL:
        draft.fileUrl = action.payload.url;
        break;

      case SET_FILE_FOCUS:
        draft.fileFocus = action.payload;
        break;

      case SET_PAGE_INVOLVERS:
        draft.pageInvolvers = action.payload;
        break;

      case SET_ALL_FILES_INVOLVERS:
        draft.allFilesInvolvers = action.payload;
        break;

      case UPDATE_APPLIED_SIGNS_SUC:
        draft.appliedSigns = action.payload;
        break;

      case GET_SIGN_TASK:
      case PUT_SIGN_TASK:
        draft.isLoading = true;
        draft.isOtpFail = false;
        break;

      case PUT_SIGN_TASK_FAL:
        draft.isLoading = false;
        break;
      case GET_SIGN_TASK_OTP_FAL:
      case PUT_SIGN_TASK_OTP_FAL:
        draft.isOtpFail = true;
        break;

      case SET_TASK_UUID:
        draft.taskUuid = action.payload.uuid;
        break;

      case SET_ATTACHMENTS_UPLOADED:
        draft.attachments = action.payload;
        break;

      case RESET_SIGN:
      case RESET_SIGN_ONLY:
        Object.keys(initialState).map((key) => {
          if (key === "signs" || key === "focus") {
            return null;
          }

          draft[key] = initialState[key];
        });
        break;

      case SET_STAGES_UPDATE:
        draft.stagesUpdate = action.payload;
        break;

      case SET_TASK_ID:
        draft.task_id = action.payload;
        break;

      case POST_KIOSK_VERIFY_SUC:
        draft.isLoading = false;
        draft.appliedSigns = [];
        Object.keys(action.payload).forEach((key) => {
          draft[key] = action.payload[key];
        });
        break;

      case POST_SAVE_AS_TEMPLATE_SUC:
      case POST_SAVE_AS_TEMPLATE_FAL:
        draft.isLoading = false;
        break;

      case SAVE_IDENTITY_CHECK_TOKEN:
        draft.identity_verify_token = action.payload.token;
        break;

      case SET_PHOTO_SIGNATURES:
        draft.photoSignatures = action.payload;
        break;

      case SET_IS_PUBLIC_FORM:
        draft.isPublicForm = action.payload;
        break;

      case SET_IS_PUBLIC_FORM_SIGNING:
        draft.publicFormUuid = action.payload.form_uuid;
        break;

      case GET_PUBLIC_FORM_SIGN_SUC:
      case READ_PUBLIC_FORM_SUC:
        draft.isLoading = false;
        Object.keys(action.payload).map((key) => {
          draft[key] = action.payload[key];
        });
        break;

      default:
        break;
    }
  });

export default sign;
