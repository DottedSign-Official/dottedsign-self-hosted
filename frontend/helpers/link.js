import { ENTERPRISE_CTA_LINKS } from "../constants/constants";

export const getEnterpriseCtaLink = (locale) => {
  return ENTERPRISE_CTA_LINKS[locale] || ENTERPRISE_CTA_LINKS.en;
};
