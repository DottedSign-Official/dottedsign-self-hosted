import React, { useState } from "react";
import { useRouter } from "next/router";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Wrapper, Inner, Content, Title } from "../styled";
import { LOGIN_STATE } from "../../constants/constants";

const ResetPwd = ({ isResetSuc, resetPwd, callback, t }) => {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [error, setError] = useState("");

  const props = {
    reset_password_token: router.query.token,
    password: pwd,
    password_confirmation: newPwd,
  };

  const handleResetPwd = (props) => {
    if (pwd === newPwd) {
      if (pwd.length < 8 || newPwd.length < 8) {
        setError(t("password_hint"));
      } else {
        setError("");
        resetPwd(props);
      }
    } else {
      setError(t("password_mismatch_hint"));
    }
  };

  return (
    <Wrapper>
      <Inner>
        {isResetSuc ? (
          <>
            <Content>
              <Title>{t("reset_success_title")}</Title>
              <p>{t("reset_success_hint")}</p>
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
              <Title>{t("reset_password")}</Title>
              <InputField
                type="password"
                placeholder={t("new_password")}
                callbackValue={(value) => setPwd(value)}
              />
              <InputField
                type="password"
                placeholder={t("confirm")}
                errorHint={error}
                callbackValue={(value) => setNewPwd(value)}
              />
            </Content>
            <Button type="primary" handleEvent={() => handleResetPwd(props)}>
              <p>{t("next")}</p>
            </Button>
          </>
        )}
      </Inner>
    </Wrapper>
  );
};

export default ResetPwd;
