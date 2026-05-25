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

const DEFAULT_FIELD_VALUE = "";
const Signup = ({
  isLoading,
  callback,
  register,
  onKeyDown,
  isRegisterSuc,
  t,
}) => {
  const [formState, setFormState] = useState({
    name: DEFAULT_FIELD_VALUE,
    email: DEFAULT_FIELD_VALUE,
    password: DEFAULT_FIELD_VALUE,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    requiredValidator,
    emailValidator,
    passwordValidator,
    trimValidator,
  } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      name: [requiredValidator, trimValidator],
      email: [emailValidator],
      password: [passwordValidator],
    }),
    [requiredValidator, emailValidator, passwordValidator, trimValidator],
  );
  const { validateAll } = useFormValidations(fieldValidators);
  const { validate, formErrors } = useFormValidations(fieldValidators);

  const handleChangeFactory = (key) => {
    return (value) => {
      const newState = {
        ...formState,
        [key]: value,
      };
      setFormState(newState);
      validate(newState, key);
      setIsFormValid(validateAll(newState));
    };
  };

  const handleNameChange = handleChangeFactory("name");
  const handleEmailChange = handleChangeFactory("email");
  const handlePasswordChange = handleChangeFactory("password");

  const handleRegister = () => {
    if (isFormValid) {
      register(formState);
    }
  };

  return (
    <Wrapper>
      <Inner>
        {isRegisterSuc ? (
          <>
            <Content>
              <Title>{t("congrats")}</Title>
              <Logo />
              <p>{t("verify_email")}</p>
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
              <Title>{t("create_account")}</Title>
              <Logo />
              <InputField
                type="text"
                placeholder={t("name")}
                callbackValue={handleNameChange}
                errorHint={formErrors.name}
                onKeyDown={(e) => onKeyDown(e, () => handleRegister())}
              />
              <InputField
                type="text"
                placeholder={t("email")}
                callbackValue={handleEmailChange}
                errorHint={formErrors.email}
                onKeyDown={(e) => onKeyDown(e, () => handleRegister())}
              />
              <InputField
                type="password"
                placeholder={t("password")}
                content={t("password_hint")}
                callbackValue={handlePasswordChange}
                errorHint={formErrors.password}
                onKeyDown={(e) => onKeyDown(e, () => handleRegister())}
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
                handleEvent={handleRegister}
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

export default Signup;
