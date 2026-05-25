import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import { Label, TipsSection, TipsContent, TipsIcon } from "./styled";
import * as templateActions from "../../../../redux/actions/template";

const TemplateCopy = ({ onModalClose, data }) => {
  const { templateId, templateName } = data;
  const { t } = useTranslation(["modal", "common"]);
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.template.isLoading);
  const [isFormValid, setIsFormValid] = useState(false);

  const [formState, setFormState] = useState({
    templateName: `${templateName} copy`,
  });

  const { requiredValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      templateName: [requiredValidator],
    }),
    [requiredValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  useEffect(() => {
    setIsFormValid(validateAll(formState));
  }, [validateAll, formState]);

  const handleChange = (value) => {
    const newState = {
      ...formState,
      templateName: value,
    };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleSubmit = () => {
    if (isFormValid) {
      dispatch(
        templateActions.duplicateTemplate({
          template_id: templateId,
          template_name: formState.templateName,
        }),
      );
    }
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("template_more_copy", { ns: "common" })}</Title>
      <Body>
        <Content>
          <TipsSection>
            <TipsIcon>
              <Icon type="tips" />
            </TipsIcon>
            <TipsContent>
              <div>{t("duplicate_template_description")}</div>
            </TipsContent>
          </TipsSection>
          <Label>{t("template_name")} *</Label>
          <InputField
            errorHint={t(formErrors.templateName)}
            defaultValue={formState.templateName}
            callbackValue={handleChange}
            placeholder={t("template_name_placeholder")}
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
          handleEvent={isFormValid ? handleSubmit : null}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default TemplateCopy;
