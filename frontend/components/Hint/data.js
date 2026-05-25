import {
  PDF_TASK_HINT,
  AUTH_ERROR,
  SYSTEM_HINT,
  GROUP_HINT,
} from "../../constants/constants";

const data = {
  [PDF_TASK_HINT.login]: {
    msg: "warning_pdf_task_login",
    color: "red",
  },
  [PDF_TASK_HINT.deny]: {
    msg: "warning_pdf_task_deny",
    color: "red",
  },
  [PDF_TASK_HINT.wait]: {
    msg: "warning_pdf_task_wait",
    color: "red",
  },
  [PDF_TASK_HINT.waitAll]: {
    msg: "warning_pdf_task_wait_all",
    color: "red",
  },
  [PDF_TASK_HINT.waitAllAdmin]: {
    msg: "warning_pdf_task_wait_all_admin",
    color: "red",
  },
  [PDF_TASK_HINT.waitServer]: {
    msg: "warning_pdf_task_wait_server",
    color: "red",
  },
  [PDF_TASK_HINT.waitChecking]: {
    msg: "warning_pdf_task_wait_checking",
    color: "red",
  },
  [PDF_TASK_HINT.handling]: {
    msg: "warning_pdf_task_handling",
    color: "red",
  },
  [PDF_TASK_HINT.notFinished]: {
    msg: "warning_pdf_task_not_finished",
    color: "red",
  },
  [PDF_TASK_HINT.expired]: {
    msg: "warning_pdf_task_expired",
    color: "red",
  },
  [PDF_TASK_HINT.declined]: {
    msg: "warning_pdf_task_declined",
    color: "red",
  },
  [SYSTEM_HINT.systemCAVerify]: {
    msg: "warning_system_ca",
    color: "red",
  },

  [AUTH_ERROR.loginFirst]: {
    msg: "warning_auth_error_login_first",
    color: "yellow",
  },
  [AUTH_ERROR.loginFirstNoEmail]: {
    msg: "warning_auth_error_login_first_no_email",
    color: "yellow",
  },
  [AUTH_ERROR.noEmail]: {
    msg: "warning_auth_error_no_email",
    color: "yellow",
  },
  [AUTH_ERROR.needConfirm]: {
    msg: "warning_auth_error_need_confirm",
    color: "yellow",
  },

  [GROUP_HINT.accessDenied]: {
    msg: "warning_group_access_denied",
    color: "yellow",
    isClosable: true,
  },
  [GROUP_HINT.groupExpired]: {
    msg: "warning_group_expired",
    color: "yellow",
  },
  [GROUP_HINT.groupExpiredAdmin]: {
    msg: "warning_group_expired_admin",
    color: "yellow",
  },
  [GROUP_HINT.taskSuspended]: {
    msg: "warning_group_task_suspended",
    color: "red",
  },

  [PDF_TASK_HINT.reviewing]: {
    id: "hint_reviewing",
    msg: "warning_pdf_task_reviewing",
    color: "blue",
  },
  [PDF_TASK_HINT.reviewPassed]: {
    msg: "warning_pdf_task_review_passed",
    color: "blue",
  },
};

export default data;
