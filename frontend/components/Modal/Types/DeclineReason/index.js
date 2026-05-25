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
import {
  WrapperEle,
  Label,
  Textarea,
  WrapperError,
  Error,
} from "../../../../global/styledForm";

import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";

const DeclineReason = ({ onModalClose, data }) => {
  const { t } = useTranslation(["modal", "admin", "common"]);
  const { declineReason, onSubmit } = data;
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState(declineReason);

  const { requiredValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      content: [requiredValidator],
    }),
    [requiredValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    const newFormState = {
      ...formState,
      content: newValue,
    };
    setFormState(newFormState);
    setIsFormValid(validateAll(newFormState));
  };

  const handleCreate = () => {
    onSubmit(formState);
  };

  return (
    <Wrapper width="50vw">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("decline_reason", { ns: "admin" })}</Title>
      <Body>
        <Content>
          <WrapperEle>
            <Label>{t("reason", { ns: "admin" })}</Label>
            <Textarea
              name="content"
              rows={10}
              value={formState.content}
              onChange={handleContentChange}
            />
            {formErrors.content && (
              <WrapperError>
                <Error>{formErrors.content}</Error>
              </WrapperError>
            )}
          </WrapperEle>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? handleCreate : null}
        >
          {declineReason.content
            ? t("save", { ns: "common" })
            : t("create", { ns: "common" })}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default DeclineReason;
