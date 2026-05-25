import { VALIDATION_TYPE } from "../constants/constants";
import regexTest from "../constants/regex";

export const VALIDATE_MESSAGE = {
  pass: "pass",
  isEmpty: "isEmpty",
  lengthExceed: "lengthExceed",
  regexFailed: "regexFailed",
};

export const getTextFiledValidator = ({
  length,
  validation,
  validation_regex,
}) => {
  const validatorWithMessage = (value) => {
    if (!value) {
      return VALIDATE_MESSAGE.isEmpty;
    }
    if (value.length > length) {
      return VALIDATE_MESSAGE.lengthExceed;
    }

    if (validation && validation !== VALIDATION_TYPE.NONE) {
      if (validation === VALIDATION_TYPE.REGEX) {
        const tester = new RegExp(validation_regex);
        return tester.test(value)
          ? VALIDATE_MESSAGE.pass
          : VALIDATE_MESSAGE.regexFailed;
      } else {
        const tester = new RegExp(regexTest[validation]);
        return tester.test(value)
          ? VALIDATE_MESSAGE.pass
          : VALIDATE_MESSAGE.regexFailed;
      }
    }

    return VALIDATE_MESSAGE.pass;
  };

  const validator = (value) => {
    const message = validatorWithMessage(value);
    return message === VALIDATE_MESSAGE.pass;
  };

  return { validator, validatorWithMessage };
};

export const creditCardFormatter = (text) => {
  const CREDIT_CARD_PLACEHOLDER = "-";
  const LENGTH_LIMIT_OF_CREDIT_CARD = 16;

  const valueWithPlaceholder = text
    .split("")
    .filter((value) => value !== CREDIT_CARD_PLACEHOLDER)
    .filter((_, index) => index < LENGTH_LIMIT_OF_CREDIT_CARD)
    .reduce((prev, value, index) => {
      if (index && !(index % 4)) {
        return [...prev, CREDIT_CARD_PLACEHOLDER, value];
      }
      return [...prev, value];
    }, [])
    .join("");

  return valueWithPlaceholder;
};

export const updatePhotoSignatures = ({ photoSignatures, url, id, email }) => {
  const map = new Map(
    photoSignatures.map((signature) => [signature.id, signature]),
  );
  map.set(id, { url, id, email });
  return Array.from(map.values());
};
