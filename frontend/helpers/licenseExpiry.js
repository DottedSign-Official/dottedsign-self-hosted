import { LICENSE_EXPIRY_WARNING_DAYS } from "../constants/licenseTypes";

const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getLicenseExpiryInfo = (licenseData, now = new Date()) => {
  const starts_at = licenseData?.starts_at;
  const expires_at = licenseData?.expires_at;

  if (!expires_at) {
    return null;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expiresDate = parseLocalDate(expires_at);
  const daysRemaining = Math.round((expiresDate - today) / 86400000);

  let hintType;

  if (daysRemaining < 0) {
    hintType = "expired";
  } else if (daysRemaining === 0) {
    hintType = "warning";
  } else if (daysRemaining <= LICENSE_EXPIRY_WARNING_DAYS) {
    hintType = "warning";
  } else {
    hintType = null;
  }

  return {
    starts_at,
    expires_at,
    hintType,
  };
};
