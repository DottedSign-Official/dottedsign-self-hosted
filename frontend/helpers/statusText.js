import {
  STAGE_ACTION,
  PDF_TASK_PERSONAL_STATUS,
  PDF_TASK_PERSONAL_STATUS_TEXT,
} from "../constants/constants";
import { statusColor } from "../global/styled";

export const getReviewStatus = (info, infos) => {
  if (info?.action_type === PDF_TASK_PERSONAL_STATUS.done) {
    return PDF_TASK_PERSONAL_STATUS.review_done;
  }

  if (info?.action_type === PDF_TASK_PERSONAL_STATUS.processing) {
    return PDF_TASK_PERSONAL_STATUS.reviewing;
  }

  if (info?.action_type === PDF_TASK_PERSONAL_STATUS.initial) {
    const signerStage = infos?.find(
      (i) => i.stage_id === info?.actor_info.base_stage_id,
    );

    if (
      signerStage &&
      signerStage.action_type === PDF_TASK_PERSONAL_STATUS.modifying
    ) {
      return PDF_TASK_PERSONAL_STATUS.review_pending;
    }

    return PDF_TASK_PERSONAL_STATUS.initial;
  }

  return info?.action_type || PDF_TASK_PERSONAL_STATUS.default;
};

export const statusToText = (info, infos) => {
  if (info?.action === STAGE_ACTION.review) {
    const status = getReviewStatus(info, infos);
    return PDF_TASK_PERSONAL_STATUS_TEXT[status];
  }

  return (
    PDF_TASK_PERSONAL_STATUS_TEXT[info?.action_type] ||
    PDF_TASK_PERSONAL_STATUS_TEXT.default
  );
};

export const statusToTextColor = (status, action) => {
  if (
    action === STAGE_ACTION.review &&
    status === PDF_TASK_PERSONAL_STATUS.processing
  ) {
    return statusColor.reviewing;
  }

  return statusColor[status] || statusColor.original;
};

export default statusToText;
