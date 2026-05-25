import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import FieldIdComp from "../../components/FieldId";

const FieldId = ({ data, myObj, onUpdateFieldId }) => {
  const [fieldId, setFieldId] = useState(data.fieldObj.custom_id || "");
  const [isFieldIdFormatError, setIsFieldIdFormatError] = useState(false);
  const [isFieldIdDuplicateError, setIsFieldIdDuplicateError] = useState(false);
  const stages = useSelector((state) => state.create.stages);
  const { t } = useTranslation("modal");
  const isError = isFieldIdFormatError || isFieldIdDuplicateError;

  useEffect(() => {
    if (isError) {
      return;
    }
    onUpdateFieldId(fieldId);
  }, [fieldId, onUpdateFieldId, isError]);

  const onUpdate = (e) => {
    const regex = new RegExp(/^(?=.{0,50}$)([a-zA-Z0-9_-])*$/);
    const isError = !regex.test(e.target.value);
    const customIds = stages.map((el) => ({
      id: el.id,
      custom_id: el.custom_id,
    }));
    const isDuplicated = !!customIds.find(
      (el) => myObj.id !== el.id && e.target.value === el.custom_id,
    );

    setIsFieldIdFormatError(isError);
    setIsFieldIdDuplicateError(isDuplicated);
    setFieldId(e.target.value);
  };

  return (
    <FieldIdComp
      fieldId={fieldId}
      isFieldIdFormatError={isFieldIdFormatError}
      isFieldIdDuplicateError={isFieldIdDuplicateError}
      onUpdate={onUpdate}
      t={t}
    />
  );
};

export default FieldId;
