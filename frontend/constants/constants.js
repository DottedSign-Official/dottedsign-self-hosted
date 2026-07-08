export const panelTypes = {
  sign: "signature",
  date: "datefield",
  text: "textfield",
  checkbox: "checkbox",
  radio: "radio",
  checkboxGroup: "checkboxGroup",
  radioGroup: "radioGroup",
  image: "image",
  link: "link",
  profile: "profile",
  systemTime: "systemtime",
};

export const fieldTypes = {
  sign: "signature",
  text: "textfield",
  checkbox: "checkbox",
  image: "image",
  link: "link",
  profile: "profile",
  systemTime: "systemtime",

  radio: "radio", // NOTE: only passed from the backend
  date: "datefield", // NOTE: only passed from the backend
};

export const fieldGroupTypes = {
  checkbox: "checkbox",
  radio: "radio",
};

export const VERIFY_STATUS = {
  noToken: "noToken",
  verifyInprocess: "verifyInprocess",
  verifySuc: "verifySuc",
  verifyFal: "verifyFal",
};

export const ACCEPT_STATUS = {
  noToken: "noToken",
  tokenInvalid: "tokenInvalid",
  needRegisterFirst: "needRegisterFirst",
  accepted: "accepted",
  acceptSuc: "acceptSuc",
  acceptFal: "acceptFal",
  overGroupLimit: "overGroupLimit",
};

export const COMMON_ERROR = {
  verificationRequired: "verificationRequired",
  error: "error",
};

export const PREVIEW_ERROR = {
  fileDeleted: "fileDeleted",
  invalidToken: "invalidToken",
  fetchError: "fetchError",
  notLoggedIn: "notLoggedIn",
  accessDenied: "accessDenied",
  publicFormUnavailable: "publicFormUnavailable",
};

export const PREVIEW_SHARE_TASK_WARNING = {
  invalidPreviewCode: "invalidPreviewCode",
  taskNotFound: "taskNotFound",
};

export const PDF_TASK_WARNING = {
  caFailed: "caFailed",
  taskDeleted: "taskDeleted",
  loginFirst: "loginFirst",
  accessDeny: "accessDeny",
  linkInvalid: "linkInvalid",
  signSucc: "signSucc",
  checkSucc: "checkSucc",
  modifySucc: "modifySucc",
  guestSignSucc: "guestSignSucc",
  publicFormSignSucc: "publicFormSignSucc",
  signFail: "signFail",
  contactInvalid: "contactInvalid",
  emailBounced: "emailBounced",
  duplicateWorkingState: "duplicateWorkingState",
  signatureNotFound: "signatureNotFound",
  beenForwarded: "beenForwarded",
  beenDeclined: "beenDeclined",
  codeExpired: "codeExpired",
  taskExpired: "taskExpired",
  fileNotReady: "fileNotReady",
};

export const PDF_RENDER_TYPE = {
  edit: "edit",
  blocked: "blocked",
};

export const PDF_TASK_HINT = {
  login: "login",
  deny: "deny",
  wait: "wait",
  waitAll: "waitAll",
  waitAllAdmin: "waitAllAdmin",
  waitServer: "waitServer",
  waitChecking: "waitChecking",
  notFinished: "notFinished",
  handling: "handling",
  expired: "expired",
  declined: "declined",
  reviewing: "reviewing",
  reviewPassed: "reviewPassed",
};

export const LICENSE_EXPIRY_HINT = {
  warning: "licenseExpiryWarning",
  expired: "licenseExpiryExpired",
};

export const PDF_TASK_STATUS = {
  waiting: "waiting",
  completed: "completed",
  deleted: "deleted",
  draft: "draft",
  expired: "expired",
  declined: "declined",
};

export const TASK_STATUS_BAR_ITEMS = {
  waiting_for_me: "task_status_detail_wait_me",
  waiting_for_others: "task_status_detail_wait_others",
  completed: "task_status_detail_completed",
  canceled: "task_status_detail_canceled",
  draft: "task_status_detail_draft",
  reissue_for_me: "task_status_detail_rollback",
};

export const TASK_STATUS_TEXT = {
  waiting: "task_status_waiting",
  completed: "task_status_completed",
  deleted: "task_status_deleted",
  draft: "task_status_draft",
  expired: "task_status_expired",
};

export const PDF_TASK_PERSONAL_STATUS = {
  send: "send",
  processing: "processing",
  signed: "signed",
  processingFile: "processing_file",
  done: "done",
  initial: "initial",
  modifying: "modifying",
  reviewing: "reviewing",
  review_pending: "review_pending",
  reviewed: "reviewed",
  review_done: "review_done",
  canceled: "canceled",
  declined: "declined",
  processing_file_failed: "processing_file_failed",
};

export const PDF_TASK_PERSONAL_STATUS_TEXT = {
  [PDF_TASK_PERSONAL_STATUS.send]: "task_personal_status_send",
  [PDF_TASK_PERSONAL_STATUS.processing]: "task_personal_status_processing",
  [PDF_TASK_PERSONAL_STATUS.signed]: "task_personal_status_signed",
  [PDF_TASK_PERSONAL_STATUS.initial]: "task_personal_status_initial",
  [PDF_TASK_PERSONAL_STATUS.modifying]: "task_personal_status_modifying",
  [PDF_TASK_PERSONAL_STATUS.reviewing]: "task_personal_status_review",
  [PDF_TASK_PERSONAL_STATUS.review_pending]:
    "task_personal_status_review_pending",
  [PDF_TASK_PERSONAL_STATUS.reviewed]: "task_personal_status_reviewed",
  [PDF_TASK_PERSONAL_STATUS.review_done]: "task_personal_status_review_done",
  [PDF_TASK_PERSONAL_STATUS.done]: "task_personal_status_done",
  [PDF_TASK_PERSONAL_STATUS.canceled]: "task_personal_status_canceled",
  [PDF_TASK_PERSONAL_STATUS.declined]: "task_personal_status_declined",
  [PDF_TASK_PERSONAL_STATUS.processing_file_failed]:
    "task_personal_status_processing_file_failed",
  default: "-",
};

export const FLOW_GRAPH_BRANCH_TYPE = {
  colored: "colored",
  plain: "plain",
  hide: "hide",
};

export const PDF_DOCUMENT_STATUS = {
  created: "Created",
  modified: "Modified",
  send: "Sent",
  viewed: "Viewed",
  signed: "Signed",
  deleted: "Deleted",
};

export const TAB = {
  more: "more",
};

export const MEDIA = {
  pad: 768,
  mobile: 568,
};

export const MODAL_TYPE = {
  accountEdit: "accountEdit",
  accountChangePassword: "accountChangePassword",
  changeNameConfirm: "changeNameConfirm",
  changePasswordConfirm: "changePasswordConfirm",
  createConfirm: "createConfirm",
  checkConfirm: "checkConfirm",
  createConfirmSS: "createConfirmSS",
  createConfirmTemplate: "createConfirmTemplate",
  createConfirmFrontDesk: "createConfirmFrontDesk",
  publicFormSignerInfo: "publicFormSignerInfo",
  createLeaveConfirm: "createLeaveConfirm",
  fileDelete: "fileDelete",
  fileInfo: "fileInfo",
  fileRename: "fileRename",
  manageSigners: "manageSigners",
  signDeleteConfirm: "signDeleteConfirm",
  signhereConfirm: "signhereConfirm",
  otpVerify: "otpVerify",
  taskInfoUpdate: "taskInfoUpdate",
  notifyOwner: "notifyOwner",
  changeSigner: "changeSigner",
  changeOwner: "changeOwner",
  changeSignerWhite: "changeSignerWhite",
  organizationModifyAdmin: "organizationModifyAdmin",
  attachmentField: "attachmentField",
  templateDel: "templateDel",
  templateRename: "templateRename",
  templateSelection: "templateSelection",
  templateChangeCode: "templateChangeCode",
  templateCopy: "templateCopy",
  attachmentUpload: "attachmentUpload",
  labelManagement: "labelManagement",
  langChange: "langChange",
  senderMessage: "senderMessage",
  stampCreator: "stampCreator",
  fieldProperty: "fieldProperty",
  fieldPropertyGroup: "fieldPropertyGroup",
  openLink: "openLink",
  imageProcessing: "imageProcessing",
  fieldPropertySigner: "fieldPropertySigner",
  notifyHotkeys: "notifyHotkeys",
  signerPermissions: "signerPermissions",
  signerCombineConfirm: "signerCombineConfirm",
  groupCreate: "groupCreate",
  groupMemberDeleteConfirm: "groupMemberDeleteConfirm",
  userInvite: "userInvite",
  textInput: "textInput",
  declineToSign: "declineToSign",
  declineReason: "declineReason",
  label: "label",
  labelDeleteConfirm: "labelDeleteConfirm",
  backgroundRemovalConfirm: "backgroundRemovalConfirm",
  signerSettings: "signerSettings",
  authMethod: "authMethod",
  authIdentity: "authIdentity",
  chtVerify: "chtVerify",
  caCreate: "caCreate",
  caEdit: "caEdit",
  systemCAMember: "systemCAMember",
  confirm: "confirm",
  consent: "consent",
  kioskSignerInfo: "kioskSignerInfo",
  rolesMore: "rolesMore",
  interLocking: "interLocking",
  previewShareLink: "previewShareLink",
  signerSettingsFd: "signerSettingsFd",
  templateAdminShare: "templateAdminShare",
  deleteTemplateAdminShare: "deleteTemplateAdminShare",
  attachmentViewer: "attachmentViewer",
  roleModal: "roleModal",
  editTemplateDocuments: "editTemplateDocuments",
  taskResend: "taskResend",
  saveAsTemplate: "saveAsTemplate",
  reviewComplete: "reviewComplete",
  checkerMsg: "checkerMsg",
  reviewPassedConfirm: "ReviewPassedConfirm",
  signingGroup: "signingGroup",
  signingGroupDelete: "signingGroupDelete",
  signingGroupRename: "signingGroupRename",
  signingGroupShare: "signingGroupShare",
  signingGroupImport: "signingGroupImport",
  signingGroupDetails: "signingGroupDetails",
  signingGroupOverwrite: "signingGroupOverwrite",
  taskOnBackHint: "taskOnBackHint",
  enterprisePlanCta: "enterprisePlanCta",
  completionPassword: "completionPassword",
};

export const ENTERPRISE_CTA_COOKIE = "enterprise_cta_dismissed";
export const ENTERPRISE_CTA_LINKS = {
  en: "https://www.dottedsign.com/request-demo/?help=inquiry_enterprise_plan&utm_source=App&utm_campaign=App_SelfHosted_contactus&utm_medium=SelfHosted",
  "zh-tw":
    "https://www.dottedsign.com/zh-tw/request-demo/?help=inquiry_enterprise_plan&utm_source=App&utm_campaign=App_SelfHosted_contactus&utm_medium=SelfHosted",
};

export const rolesSystem = ["admin", "manager", "member"];

export const TEMPLATE_SEARCH_TYPE = {
  name: "SEARCH_TEMPLATE_TYPE_NAME",
  code: "SEARCH_TEMPLATE_TYPE_CODE",
};

export const SIGN_COLOR_TAG = ["blue", "red", "black"];

export const AUTH_ERROR = {
  loginFirst: "loginFirst",
  loginFirstNoEmail: "loginFirstNoEmail",
  noEmail: "noEmail",
  needConfirm: "needConfirm",
  resendDone: "resendDone",
};

export const GROUP_HINT = {
  accessDenied: "accessDenied",
  groupExpired: "groupExpired",
  groupExpiredAdmin: "groupExpiredAdmin",
  taskSuspended: "taskSuspended",
};

export const SYSTEM_HINT = {
  systemCAVerify: "systemCAVerify",
};

export const SIGN_PANEL = {
  connectError: "connectError",
  mobileDeviceOnly: "mobileDeviceOnly",
};

export const EMBEDDED_STATUS = {
  timeout: "timeout",
  paramsError: "paramsError",
  otpRequiredError: "otpRequiredError",
  domainError: "domainError",
  apiKeyError: "apiKeyError",
  tokenError: "tokenError",
  notPermitted: "notPermitted",
  invalidTask: "invalidTask",
  unableFetchTemplate: "unableFetchTemplate",
  invalidTemplate: "invalidTemplate",
  orderInvalidTemplate: "orderInvalidTemplate",
  unableCreateKiosk: "unableCreatKiosk",
  kioskInvalidClient: "kioskInvalidClient",
  kioskStageVerifyFailed: "kioskStageVerifyFailed",
  kioskStageNeedVerify: "kioskStageNeedVerify",
  commonError: "commonError",
  embeddedSuc: "embeddedSuc",
  overLimit: "overLimit",
  invalidApiKey: "invalidApiKey",
  notSupported: "notSupported",
};

export const uploadFieldStyle = {
  textOnly: "textOnly",
  btnOnly: "btnOnly",
  textWithBack: "textWithBack",
  btnWithBack: "btnWithBack",
};

export const uploadFormatType = {
  csv: "csv",
  image: "image",
  pdf: "pdf",
  all: "all",
  attachment: "attachment",
};

// NOTE: list for accept, dpzone
// NOTE: fileType for real file type
export const uploadFormat = {
  csv: {
    list: [".csv"],
    fileType: [
      "text/csv",
      "application/vnd.ms-excel",
      "text/comma-separated-values",
      "application/csv",
      "application/excel",
      "application/vnd.msexcel",
    ],
    error: "commonFormatError",
  },
  image: {
    list: ["image/jpg", "image/jpeg", "image/png"],
    fileType: ["image/jpg", "image/jpeg", "image/png"],
    error: "imgFormatError",
  },
  pdf: {
    list: ["application/pdf"],
    fileType: ["application/pdf"],
    error: "fileFormatError",
  },
  all: {
    list: ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
    fileType: ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
    error: "commonFormatError",
  },
};

export const dateSetting = [
  {
    key: "no_limit",
    text: "no_limited",
  },
  {
    key: "current_only",
    text: "today",
  },
  {
    key: "past_enable",
    text: "before_today",
  },
  {
    key: "future_enable",
    text: "after_today",
  },
];

export const SYSTEM_TIME_TYPE = {
  YEAR_AD: "year_ad",
  YEAR_ROC: "year_roc",
  MONTH: "month",
  DAY: "day",
};
export const systemTimeI18Keys = {
  [SYSTEM_TIME_TYPE.YEAR_AD]: "input_systemTime_year_ad",
  [SYSTEM_TIME_TYPE.YEAR_ROC]: "input_systemTime_year_roc",
  [SYSTEM_TIME_TYPE.MONTH]: "input_systemTime_month",
  [SYSTEM_TIME_TYPE.DAY]: "input_systemTime_day",
};
export const systemTimeSetting = [
  {
    key: SYSTEM_TIME_TYPE.YEAR_AD,
    text: "systemTime_year_ad",
  },
  {
    key: SYSTEM_TIME_TYPE.YEAR_ROC,
    text: "systemTime_year_roc",
  },
  {
    key: SYSTEM_TIME_TYPE.MONTH,
    text: "systemTime_month",
  },
  {
    key: SYSTEM_TIME_TYPE.DAY,
    text: "systemTime_day",
  },
];

export const dateFormats = [
  "yyyy/mm/dd",
  "dd/mm/yyyy",
  "yyyy-mm-dd",
  "mm-dd-yyyy",
];

export const dateFormatsToday = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  return [
    `${y}/${m}/${d}`,
    `${d}/${m}/${y}`,
    `${y}-${m}-${d}`,
    `${m}-${d}-${y}`,
  ];
};

export const dateFormatsSelection = () => {
  const todays = dateFormatsToday();

  return dateFormats.map((d, idx) => {
    return {
      format: d,
      text: todays[idx],
    };
  });
};

export const taskFilter = {
  expire_soon: "expire_soon",
};

export const USER_STATUS = {
  waiting: "waiting",
  accepted: "accepted",
  removed: "removed",
  canceled: "canceled",
  disabled: "disabled",
};

export const roles = ["admin", "manager", "member"];

export const LOGIN_STATE = {
  ACCOUNT: "default",
  PWD: "pwd",
  SIGNUP: "signup",
  SIGNUP_SUC: "signup_suc",
  FORGET_PWD: "forgetPwd",
  FORGET_MAIL_SEND_SUC: "forgetPwd_suc",
  RESET_PWD: "resetPwd",
  RESET_PWD_SUC: "resetPwd_suc",
  LOGIN: "login",
};

export const fontSizeItem = [...Array(27)].map((_, idx) => ({
  key: idx + 8,
  text: idx + 8,
}));

export const ALIGNMENT_TYPE = {
  START: "start",
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};
export const itemAlignment = [
  {
    key: ALIGNMENT_TYPE.LEFT,
    text: "left",
  },
  {
    key: ALIGNMENT_TYPE.CENTER,
    text: "center",
  },
  {
    key: ALIGNMENT_TYPE.RIGHT,
    text: "right",
  },
];

export const VALIDATION_TYPE = {
  NONE: null,
  EMAIL: "email",
  NUMBERS: "numbers",
  LETTERS: "letters",
  CREDIT_CARD: "credit_card",
  LINK: "link",
  REGEX: "regex",
  COMPLETION_PASSWORD: "completion_password",
};

export const FILED_SETTING_DEFAULT_OPTIONS = {
  TEXT: {
    FONT_SIZE: 14,
    FONT_SIZE_FIXED: false,
    LENGTH: 200,
    IS_MULTI_LINE: true,
    ALIGNMENT: ALIGNMENT_TYPE.LEFT,
    ALIGNMENT_FIXED: false,
    VALIDATION: VALIDATION_TYPE.NONE,
    VALIDATION_REG: null,
  },
};

export const validationErrors = {
  required: "required",
  input_task_name_invalid: "input_task_name_invalid",
  link_error_validate: "link_error_validate",
  invalid_token_expires_in: "invalid_token_expires_in",
  id_not_unique: "id_not_unique",
  invalid_id_format: "invalid_id_format",
};

export const STAGE_TYPES = {
  edit: "edit",
  sign: "sign",
};

export const PDF_VIEWPORT_SCALE = 1;

export const STAGE_ACTION = {
  sign: "sign",
  review: "review",
};

export const TASKS_PER_PAGE = 12;
export const PUBLIC_FORM_PER_PAGE = 10;

export const PUBLIC_FORM_SIDEBAR_ITEMS = [
  {
    key: "task_status",
    text: "public_form_task_status",
    subTabs: [
      { key: "waiting_for_me", text: "task_status_detail_wait_me" },
      { key: "waiting_for_others", text: "task_status_detail_wait_others" },
      { key: "completed", text: "task_status_detail_completed" },
      { key: "canceled", text: "task_status_detail_canceled" },
      { key: "reissue_for_me", text: "task_status_detail_rollback" },
    ],
  },
  {
    key: "my_public_forms",
    text: "my_public_forms",
    subTabs: [],
  },
];

export const SIGNATURE_CATEGORY = {
  STAMP: "stamp",
  GUEST_SIGNATURE: "guest_signature",
  SIGNATURE: "signature",
  INITIAL: "initial",
  SIGNATURE_WITH_PHOTO: "signature_with_photo",
};
