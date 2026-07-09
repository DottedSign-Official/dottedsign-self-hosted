export const CHT_VERIFY_TYPES = ["cht_personal", "cht_company", "cht_system"];

export const hasChtVerify = (verify = []) => {
  return verify.some(({ verify_type }) =>
    CHT_VERIFY_TYPES.includes(verify_type),
  );
};
