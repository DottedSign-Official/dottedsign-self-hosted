import { STAGE_ACTION } from "../../constants/constants";

export const getAssigneesWarnings = (assignes, isTemplate = false) => {
  const warnings = {};

  assignes.forEach((ass) => {
    // NOTE: check CA
    if (ass.action === STAGE_ACTION.sign) {
      const hasInvalidCA = ass.verify?.some(
        ({ verify_type, verify_source }) =>
          verify_type === "cht_system" && !verify_source?.name,
      );
      if (hasInvalidCA) {
        warnings[ass.uid] = true;
      }
    }

    // NOTE: check reviewer, only if not template
    if (ass.action === STAGE_ACTION.review) {
      if (isTemplate) {
        return;
      }

      if (
        !ass.email ||
        ass.email.length < 1 ||
        !ass.name ||
        ass.name.length < 1
      ) {
        warnings[ass.actor_info.base_uid] = true;
      }
    }
  });

  return warnings;
};

export const hasWarning = (assigneesWarnings) => {
  return Object.values(assigneesWarnings || {})?.some((warning) => warning);
};
