import React from "react";
import { useTranslation } from "next-i18next";
import { Input } from "../../global/styledForm";
import { Wrapper } from "./styled";

const InputAssignes = ({
  input,
  onInputClick,
  onInputChange,
  onInputBlur,
  isReadOnly,
}) => {
  const { t } = useTranslation("common");
  return (
    <Wrapper>
      <Input
        tabIndex="566"
        onClick={onInputClick}
        onChange={onInputChange}
        onBlur={onInputBlur}
        placeholder={t("role")}
        value={input}
        readOnly={isReadOnly}
      />
    </Wrapper>
  );
};

export default InputAssignes;
