import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Portal from "../Portal";
import Icon from "../Icon";
import Btn from "../Button";
import {
  Wrapper,
  WrapperInner,
  Header,
  WrapperClose,
  Title,
  WrapperApply,
  Body,
} from "../../global/styledPanel";
import { WrapperInput } from "./styled";
import InputField from "../InputField";
import {
  useCommonValidators,
  useFormValidations,
} from "../../helpers/customHooks";

const PanelText = ({ onChange, onKeyDown, onConfirm, onPanelClose }) => {
  const { t } = useTranslation("common");

  const [isFormValid, setIsFormValid] = useState(false);
  const { requiredValidator, maxLengthValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      text: [requiredValidator, maxLengthValidator(200)],
    }),
    [requiredValidator, maxLengthValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleChange = (text) => {
    const isValid = validateAll({ text });
    setIsFormValid(isValid);
    onChange(text);
  };

  return (
    <Portal>
      <Wrapper>
        <WrapperInner>
          <Header>
            <WrapperClose onClick={onPanelClose}>
              <Icon type="cancel" />
            </WrapperClose>

            <Title>{t("panel_text_title")}</Title>

            {isFormValid && (
              <WrapperApply>
                <Btn type="primaryFlex" handleEvent={onConfirm}>
                  {t("btn_apply")}
                </Btn>
              </WrapperApply>
            )}
          </Header>

          <Body id="textBox">
            <WrapperInput>
              <InputField
                errorHint={formErrors.text}
                callbackValue={handleChange}
                placeholder={t("input_placeholder")}
                onKeyDown={isFormValid ? onKeyDown : null}
              />
            </WrapperInput>
          </Body>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default PanelText;
