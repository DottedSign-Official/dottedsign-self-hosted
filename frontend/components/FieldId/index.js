import React from "react";
import { Input } from "../../global/styledForm";
import { ErrorHint } from "./styled";

const FieldId = ({
  fieldId,
  onUpdate,
  isFieldIdFormatError,
  isFieldIdDuplicateError,
  t,
}) => {
  return (
    <>
      <Input value={fieldId} onChange={onUpdate} />
      <ErrorHint isError={isFieldIdFormatError || isFieldIdDuplicateError}>
        {isFieldIdFormatError && t("invalid_fieldid")}
        {isFieldIdDuplicateError && t("duplicate_fieldid")}
      </ErrorHint>
    </>
  );
};

export default FieldId;
