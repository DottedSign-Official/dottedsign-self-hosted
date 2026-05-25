import { VALIDATION_TYPE } from "./constants";

const regex = {
  [VALIDATION_TYPE.NUMBERS]: "^[0-9]+$",
  [VALIDATION_TYPE.LETTERS]: "^[A-Za-z]+$",
  [VALIDATION_TYPE.EMAIL]:
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
  [VALIDATION_TYPE.CREDIT_CARD]:
    "^((4\\d{3})|(5[1-5]\\d{2})|(6011)|(7\\d{3}))-?\\d{4}-?\\d{4}-?\\d{4}|3[4,7]\\d{13}$",
  [VALIDATION_TYPE.LINK]: /\bhttps?:\/\/[^\s]+/g,
};

export default regex;
