import {
  ACCEPT_STATUS,
  EMBEDDED_STATUS,
  PREVIEW_ERROR,
  PDF_TASK_WARNING,
  AUTH_ERROR,
  COMMON_ERROR,
  SIGN_PANEL,
  PREVIEW_SHARE_TASK_WARNING,
} from "../../constants/constants";

const data = {
  [PREVIEW_ERROR.fileDeleted]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_file_deleted_title",
    desc: "error_preview_file_deleted_desc",
  },
  [PREVIEW_ERROR.invalidToken]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_invalid_token_title",
    desc: "error_preview_invalid_token_desc",
  },
  [PREVIEW_ERROR.notLoggedIn]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_not_logged_in_title",
    desc: "error_preview_not_logged_in_desc",
  },
  [PREVIEW_ERROR.accessDenied]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_access_denied_title",
    desc: "error_preview_access_denied_desc",
  },
  [PREVIEW_ERROR.publicFormUnavailable]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_public_form_unavailable_title",
    desc: "error_preview_public_form_unavailable_desc",
  },
  [PREVIEW_SHARE_TASK_WARNING.invalidPreviewCode]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_share_invalid_code_title",
    desc: "error_preview_share_invalid_code_desc",
  },
  [PREVIEW_SHARE_TASK_WARNING.taskNotFound]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_share_task_not_found_title",
    desc: "error_preview_share_task_not_found_desc",
  },
  [PDF_TASK_WARNING.loginFirst]: {
    icon: "/static/images/hint/completed.png",
    title: "error_pdf_task_login_title",
    desc: "error_pdf_task_login_desc",
  },
  [PDF_TASK_WARNING.accessDeny]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_access_title",
    desc: "error_pdf_task_access_desc",
  },
  [PDF_TASK_WARNING.linkInvalid]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_link_invalid_title",
    desc: "error_pdf_task_link_invalid_desc",
  },
  [PDF_TASK_WARNING.signSucc]: {
    icon: "/static/images/hint/completed.png",
    title: "task_sign_succ_title",
    desc: "task_sign_succ_desc",
  },
  [PDF_TASK_WARNING.guestSignSucc]: {
    isGuestSign: true,
    icon: "/static/images/hint/completed.png",
    title: "task_sign_succ_title",
    desc: "task_guest_sign_succ_desc",
  },
  [PDF_TASK_WARNING.publicFormSignSucc]: {
    icon: "/static/images/hint/completed.png",
    title: "task_sign_succ_title",
    desc: "task_public_form_sign_succ_desc",
    hint: "task_public_form_sign_succ_hint",
  },
  [PDF_TASK_WARNING.checkSucc]: {
    icon: "/static/images/hint/completed.png",
    title: "task_check_succ_title",
    desc: "task_check_succ_desc",
  },
  [PDF_TASK_WARNING.modifySucc]: {
    icon: "/static/images/hint/completed.png",
    title: "task_modify_succ_title",
    desc: "task_modify_succ_desc",
  },
  [PDF_TASK_WARNING.signFail]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_sign_fail_title",
    desc: "error_pdf_task_sign_fail_desc",
  },
  [PDF_TASK_WARNING.contactInvalid]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_invalid_contact_title",
    desc: "error_pdf_task_invalid_contact_desc",
  },
  [PDF_TASK_WARNING.emailBounced]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_email_bounced_title",
    desc: "error_pdf_task_email_bounced_desc",
  },
  [PDF_TASK_WARNING.duplicateWorkingState]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_duplicate_working_state_title",
    desc: "error_pdf_task_duplicate_working_state_desc",
  },
  [PDF_TASK_WARNING.signatureNotFound]: {
    icon: "/static/images/hint/failed.png",
    title: "error_signature_not_found_title",
    desc: "error_signature_not_found_desc",
  },
  [PDF_TASK_WARNING.beenDeclined]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_been_declined_title",
    desc: "error_pdf_task_been_declined_desc",
  },
  [PDF_TASK_WARNING.beenForwarded]: {
    icon: "/static/images/hint/failed.png",
    title: "error_pdf_task_been_forwarded_title",
    desc: "error_pdf_task_been_forwarded_desc",
  },
  [PDF_TASK_WARNING.codeExpired]: {
    icon: "/static/images/hint/failed.png",
    title: "error_code_expired_title",
    desc: "error_code_expired_desc",
  },
  [PDF_TASK_WARNING.taskExpired]: {
    icon: "/static/images/hint/failed.png",
    title: "error_task_expired_title",
    desc: "error_task_expired_desc",
  },
  [PDF_TASK_WARNING.fileNotReady]: {
    icon: "/static/images/hint/failed.png",
    title: "error_file_not_ready_title",
    desc: "error_file_not_ready_desc",
  },
  [PDF_TASK_WARNING.caFailed]: {
    icon: "/static/images/hint/failed.png",
    title: "error_task_request_ca_failed",
    desc: "error_need_ca",
  },
  [PDF_TASK_WARNING.taskDeleted]: {
    icon: "/static/images/hint/failed.png",
    title: "error_preview_file_deleted_title",
    desc: "error_preview_file_deleted_desc",
  },
  [AUTH_ERROR.needConfirm]: {
    icon: "/static/images/hint/failed.png",
    title: "error_auth_error_need_confirm_title",
    desc: "error_auth_error_need_confirm_desc",
  },
  [AUTH_ERROR.resendDone]: {
    icon: "/static/images/hint/failed.png",
    title: "error_auth_error_resend_done_title",
    desc: "error_auth_error_resend_done_desc",
  },

  [COMMON_ERROR.verificationRequired]: {
    icon: "/static/images/hint/failed.png",
    title: "error_verification_required_title",
    desc: "error_verification_required_desc",
  },
  [COMMON_ERROR.error]: {
    icon: "/static/images/hint/failed.png",
    title: "error_common_title",
    desc: "error_common_desc",
  },

  [SIGN_PANEL.connectError]: {
    icon: "/static/images/hint/failed.png",
    title: "error_sign_panel_common_title",
    desc: "error_sign_panel_common_desc",
  },
  [SIGN_PANEL.mobileDeviceOnly]: {
    icon: "/static/images/hint/failed.png",
    title: "error_sign_panel_mobile_title",
    desc: "error_sign_panel_mobile_desc",
  },
  [EMBEDDED_STATUS.unableCreateKiosk]: {
    icon: "/static/images/hint/failed.png",
    title: "error_embedded_unable_create_kiosk_title",
    desc: "error_embedded_unable_create_kiosk_desc",
  },
  [EMBEDDED_STATUS.unableCreateKiosk]: {
    icon: "/static/images/hint/failed.png",
    title: "error_embedded_unable_create_kiosk_title",
    desc: "error_embedded_unable_create_kiosk_desc",
  },
  [EMBEDDED_STATUS.invalidTemplate]: {
    icon: "/static/images/hint/failed.png",
    title: "error_embedded_invalid_template_title",
    desc: "error_embedded_invalid_template_desc",
  },
  [EMBEDDED_STATUS.orderInvalidTemplate]: {
    icon: "/static/images/hint/failed.png",
    title: "error_embedded_order_invalid_template_title",
    desc: "error_embedded_order_invalid_template_desc",
  },

  [ACCEPT_STATUS.noToken]: {
    icon: "/static/icons/verify_fal.png",
    title: "error_no_token_title",
    desc: "error_no_token_desc",
  },
  [ACCEPT_STATUS.tokenInvalid]: {
    icon: "/static/icons/verify_fal.png",
    title: "error_token_invalid_title",
    desc: "error_token_invalid_desc",
  },
  [ACCEPT_STATUS.needRegisterFirst]: {
    isGuestSign: true,
    icon: "/static/icons/verify_fal.png",
    title: "error_register_first_title",
    desc: "error_register_first_desc",
  },
  [ACCEPT_STATUS.accepted]: {
    icon: "/static/icons/verify_suc.png",
    title: "error_already_accepted_title",
    desc: "error_already_accepted_desc",
  },
  [ACCEPT_STATUS.acceptSuc]: {
    icon: "/static/icons/verify_suc.png",
    title: "accept_group_title",
    desc: "accept_group_desc",
  },
  [ACCEPT_STATUS.acceptFal]: {
    icon: "/static/icons/verify_fal.png",
    title: "error_common_title",
    desc: "error_common_desc",
  },
  [ACCEPT_STATUS.overGroupLimit]: {
    icon: "/static/icons/verify_fal.png",
    title: "error_over_group_limit_title",
    desc: "error_over_group_limit_desc",
  },

  [EMBEDDED_STATUS.commonError]: {
    icon: "/static/icons/verify_fal.png",
    title: "error_common_title",
    desc: "error_common_desc",
  },
};

export default data;
