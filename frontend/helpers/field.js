import uuid from "uuid/v1";
import { fieldTypes } from "../constants/constants";

export const getFieldType = (fieldObj) => {
  const isRadio =
    (fieldObj.type === fieldTypes.checkbox && fieldObj.style === 1) ||
    fieldObj.type === fieldTypes.radio;
  return isRadio ? fieldTypes.radio : fieldObj.type;
};

export const createFieldId = (isGroup = false) => {
  if (isGroup) {
    return `group_${uuid()}`;
  }
  return `JackRabbit_${uuid()}`;
};
