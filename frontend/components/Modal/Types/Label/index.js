import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "../../../Button";
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
import InputField from "./InputField";
import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";

const Label = ({ onModalClose, data }) => {
  const { t } = useTranslation(["modal", "common"]);
  const { label, onSubmit } = data;
  const isCreate = !label.length;
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState({ label });

  const { requiredValidator, trimValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      label: [requiredValidator, trimValidator],
    }),
    [requiredValidator, trimValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleChange = (label) => {
    const newState = { label };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>
        {t(isCreate ? "label_new" : "label_edit", { ns: "common" })}
      </Title>
      <Body>
        <Content>
          <InputField
            errorHint={formErrors.label}
            defaultValue={label}
            callbackValue={handleChange}
          />
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? () => onSubmit(formState.label) : null}
        >
          {isCreate
            ? t("create", { ns: "common" })
            : t("save", { ns: "common" })}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default Label;
