import { VALIDATION_TYPE } from "../../constants/constants";
import regex from "../../constants/regex";

export const COMPLETION_PASSWORD_MAX_LENGTH = 50;

export const validateCompletionPassword = (value) => {
  if (!value?.trim?.()) {
    return "error_completion_password_required";
  }
  if (value.length > COMPLETION_PASSWORD_MAX_LENGTH) {
    return "error_completion_password_too_long";
  }
  if (!regex[VALIDATION_TYPE.COMPLETION_PASSWORD].test(value)) {
    return "error_completion_password_format";
  }
  return null;
};
