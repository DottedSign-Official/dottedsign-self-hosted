import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import InputField from "../../InputField";
import ButtonWithLoading from "../../ButtonWithLoading";
import {
  Wrapper,
  Inner,
  Content,
  Title,
  Logo,
  EmailField,
  BtnWrapper,
} from "./styled";
import { checkPwdValid } from "../../../helpers/checkFormat";

const ERRORS = {
  NONE: null,
  NO_WARNING: "",
  INVALID_PASSWORD: "invalid_password",
};

const Register = ({ register, isLoading, error: { member_email } }) => {
  const { t } = useTranslation("login");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ pwd: ERRORS.NO_WARNING });

  const handlePwd = (value) => {
    if (checkPwdValid(value)) {
      setPwd(value);
      setError({ pwd: ERRORS.NONE });
    } else {
      setError({ ...error, pwd: t("invalid_password") });
    }
  };

  const disabled = Object.keys(error).some(
    (value) => error[value] !== ERRORS.NONE,
  );

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Title>{t("welcome")}</Title>
          <Logo>
            <img src="/static/images/jackrabbit.png" alt="logo" />
          </Logo>
          <EmailField>{member_email}</EmailField>
          <InputField
            type="text"
            placeholder={t("name")}
            callbackValue={(value) => setUsername(value)}
          />
          <InputField
            type="password"
            placeholder={t("enter_password")}
            content={t("password_hint")}
            callbackValue={(value) => handlePwd(value)}
            errorHint={error.pwd}
          />
        </Content>
        <BtnWrapper>
          <ButtonWithLoading
            isLoading={isLoading}
            type={disabled ? "disabled" : "primary"}
            handleEvent={() => (disabled ? null : register(username, pwd))}
          >
            <p>{t("sign_up")}</p>
          </ButtonWithLoading>
        </BtnWrapper>
      </Inner>
    </Wrapper>
  );
};

export default Register;
