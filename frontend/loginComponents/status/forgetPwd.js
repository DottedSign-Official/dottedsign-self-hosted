import React, { useState } from "react";

import InputField from "../../components/InputField";
import ButtonWithLoading from "../../components/ButtonWithLoading";
import Button from "../../components/Button";
import { Wrapper, Inner, Content, Title, Logo, BtnWrapper } from "../styled";
import { LOGIN_STATE } from "../../constants/constants";
import {
  useCommonValidators,
  useFormValidations,
} from "../../helpers/customHooks";

const ForgetPwd = ({
  isLoading,
  isSendMail,
  callback,
  onKeyDown,
  forgetPwd,
  t,
}) => {
  const [formState, setFromState] = useState({ email: "" });
  const [isFormValid, setIsFormValid] = useState(true);
  const { emailValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      email: [emailValidator],
    }),
    [emailValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const onChange = (value) => {
    const newState = {
      email: value,
    };
    setFromState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleSubmit = () => {
    const isValid = validateAll(formState);
    if (isValid) {
      forgetPwd(formState);
    } else {
      setIsFormValid(false);
    }
  };

  return (
    <Wrapper>
      <Inner>
        {isSendMail ? (
          <>
            <Content>
              <Title>{t("email_sent")}</Title>
              <Logo />
              <p>{t("check_email")}</p>
            </Content>
            <Button
              type="primary"
              handleEvent={() => callback({ mode: LOGIN_STATE.ACCOUNT })}
            >
              <p>{t("back_to_login")}</p>
            </Button>
          </>
        ) : (
          <>
            <Content>
              <Title>{t("find_email")}</Title>
              <Logo />
              <InputField
                type="text"
                placeholder={t("email")}
                errorHint={formErrors.email}
                onKeyDown={(e) => onKeyDown(e, handleSubmit)}
                callbackValue={onChange}
              />
            </Content>
            <BtnWrapper>
              <Button
                type="text"
                handleEvent={() => callback({ mode: LOGIN_STATE.ACCOUNT })}
              >
                <p>{t("back_to_login")}</p>
              </Button>
              <ButtonWithLoading
                isLoading={isLoading}
                type={isFormValid ? "primary" : "disabled"}
                handleEvent={isFormValid ? handleSubmit : null}
              >
                {<p>{t("next")}</p>}
              </ButtonWithLoading>
            </BtnWrapper>
          </>
        )}
      </Inner>
    </Wrapper>
  );
};

export default ForgetPwd;
