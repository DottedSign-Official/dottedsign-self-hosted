import { PDF_TASK_PERSONAL_STATUS, STAGE_TYPES } from "../constants/constants";

export const hasEditor = (assignes) => {
  return assignes.some((assignee) => assignee.stage_type === STAGE_TYPES.edit);
};

export const isEditorAssigneOnly = (assignes) => {
  return assignes.every((ass) => ass.stage_type === STAGE_TYPES.edit);
};

export const checkEditing = (has_order, details) => {
  if (!has_order) {
    return false;
  }
  return details.some(
    (stg) =>
      stg.status === PDF_TASK_PERSONAL_STATUS.processing &&
      stg.stage_type === STAGE_TYPES.edit,
  );
};
