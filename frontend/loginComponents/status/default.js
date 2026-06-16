import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import { LICENSE_TYPE } from "../../constants/licenseTypes";
import { LOGIN_STATE } from "../../constants/constants";
import { getEnterpriseCtaLink } from "../../helpers/link";
import { checkEmailValid } from "../../helpers/checkFormat";
import { useLicenseHook } from "../../helpers/license";
import InputField from "../../components/InputField";
import ButtonWithLoading from "../../components/ButtonWithLoading";
import Button from "../../components/Button";
import {
  Wrapper,
  Inner,
  Content,
  Title,
  Logo,
  BtnWrapper,
  ButtonGroup,
  EnterpriseCta,
} from "../styled";

const Default = ({ isLoading, callback, handleLogin, onKeyDown, children }) => {
  const { t, i18n } = useTranslation("login");
  const isEnterprisePlan = useLicenseHook(LICENSE_TYPE.ENTERPRISE_PLAN);
  const enterpriseCtaLink = getEnterpriseCtaLink(i18n.language);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState({ email: null });

  const handleSetEmail = (value) => {
    if (checkEmailValid(value)) {
      setEmail(value);
      setError({ email: null });
    } else {
      setError({ email: "email_invalid" });
    }
  };

  const handleSubmit = () => {
    if (!email) {
      setError({ email: "email_empty" });
    } else if (!error.email) {
      handleLogin({ email, password: pwd });
    }
  };

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Title>{t("login")}</Title>
          <Logo />
          <InputField
            type="text"
            placeholder={t("login_placeholder")}
            errorHint={t(error.email)}
            callbackValue={(value) => handleSetEmail(value)}
          />
          <InputField
            type="password"
            placeholder={t("enter_password")}
            onKeyDown={(e) => onKeyDown(e, () => handleSubmit())}
            callbackValue={(value) => setPwd(value)}
          />
        </Content>
        <BtnWrapper>
          <ButtonGroup>
            <Button
              type="text"
              handleEvent={() => callback({ mode: LOGIN_STATE.SIGNUP })}
            >
              <p>{t("sign_up")}</p>
            </Button>
            <Button
              type="text"
              handleEvent={() => callback({ mode: LOGIN_STATE.FORGET_PWD })}
            >
              <p>{t("forget_password")}</p>
            </Button>
          </ButtonGroup>
          <ButtonWithLoading
            isLoading={isLoading}
            type={error.email ? "disabled" : "primary"}
            handleEvent={error.email ? null : handleSubmit}
          >
            {<p>{t("login")}</p>}
          </ButtonWithLoading>
        </BtnWrapper>

        {children}

        {!isEnterprisePlan && (
          <EnterpriseCta
            dangerouslySetInnerHTML={{
              __html: t("enterprise_cta", {
                link: enterpriseCtaLink,
                interpolation: { escapeValue: false },
              }),
            }}
          />
        )}
      </Inner>
    </Wrapper>
  );
};

export default Default;
