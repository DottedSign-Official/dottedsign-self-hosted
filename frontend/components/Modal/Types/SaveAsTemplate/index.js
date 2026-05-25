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
import * as signActions from "../../../../redux/actions/sign";

const SaveAsTemplate = ({ onModalClose, data }) => {
  const { taskId, filename: taskName } = data;
  const { t } = useTranslation(["modal", "common"]);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.sign.isLoading);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState({
    templateName: `${taskName} copy`,
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

  const handleChange = (templateName) => {
    const newState = { templateName };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleSubmit = () => {
    if (isFormValid) {
      dispatch(
        signActions.postSaveAsTemplate({
          sign_task_id: taskId,
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
      <Title>{t("save_as_template")}</Title>
      <Body>
        <Content>
          <TipsSection>
            <TipsIcon>
              <Icon type="tips" />
            </TipsIcon>
            <TipsContent>
              <div>{t("save_as_template_description")}</div>
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

export default SaveAsTemplate;
