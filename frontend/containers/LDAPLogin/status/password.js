import React, { useState } from "react";
import { useSelector } from "react-redux";

import InputField from "../../../components/InputField";
import ButtonWithLoading from "../../../components/ButtonWithLoading";
import { Wrapper, Inner, Content, Title, Logo, EmailField } from "../styled";

const Password = ({ email, onKeyDown, handleLogin, t }) => {
  const [pwd, setPwd] = useState("");
  const props = { email, password: pwd };

  const { isLoading } = useSelector((state) => state.login);

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Title>{t("ldap_welcome_title")}</Title>
          <Logo />
          <EmailField>{email}</EmailField>
          <InputField
            type="password"
            placeholder={t("enter_password")}
            onKeyDown={(e) => onKeyDown(e, () => handleLogin(props))}
            callbackValue={setPwd}
          />
        </Content>
        <ButtonWithLoading
          isLoading={isLoading}
          type="primary"
          handleEvent={() => handleLogin(props)}
        >
          {<p>{t("next")}</p>}
        </ButtonWithLoading>
      </Inner>
    </Wrapper>
  );
};

export default Password;
