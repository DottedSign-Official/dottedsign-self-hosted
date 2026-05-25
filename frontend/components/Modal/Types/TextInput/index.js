import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import InputField from "../../../InputField";
import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";
import ButtonWithLoading from "../../../ButtonWithLoading";

const TextInput = ({ onModalClose, data }) => {
  const { text, isLoading, title, onSubmit } = data;
  const { t } = useTranslation(["modal", "common", title.namespace]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState({ text });

  const { requiredValidator, trimValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      text: [requiredValidator, trimValidator],
    }),
    [requiredValidator, trimValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleChange = (text) => {
    const newState = { text };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t(title.text, { ns: title.namespace })}</Title>
      <Body>
        <Content>
          <InputField
            errorHint={formErrors.text}
            defaultValue={text}
            callbackValue={handleChange}
          />
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? () => onSubmit(formState.text) : null}
        >
          {t("btn_ok", { ns: "common" })}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default TextInput;
