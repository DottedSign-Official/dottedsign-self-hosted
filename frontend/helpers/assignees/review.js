import { STAGE_ACTION } from "../../constants/constants";

export const filterSignerAssignes = (assignes) => {
  if (!Array.isArray(assignes)) {
    return [];
  }
  return assignes.filter((ass) => ass.action !== STAGE_ACTION.review);
};

export const isReviewAction = (assigne) => {
  return assigne.action === STAGE_ACTION.review;
};
