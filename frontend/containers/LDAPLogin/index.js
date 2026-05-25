import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Cookie from "js-cookie";
import { login, setMode as setModeAction } from "../../redux/actions/login";
import { isExist } from "../../helpers/others";

import Account from "./status/account";
import Pwd from "./status/password";
import { LOGIN_STATE } from "../../constants/constants";

const LOGIN_REDIRECT_PATH = "/tasks";
const Login = ({ type }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.login.mode);
  const { t } = useTranslation("login");

  const setMode = useCallback(
    (data) => dispatch(setModeAction(data)),
    [dispatch],
  );
  const [email, setEmail] = useState("");

  const handleCallback = (value) => setMode(value.mode);

  const handleCheckEmail = (value) => {
    setEmail(value);
    setMode(LOGIN_STATE.PWD);
  };

  const handleLogin = (data) => dispatch(login({ ...data, provider: "ldap" }));

  const onKeyDown = (e, handleEvent) => {
    if (e.keyCode === 13) {
      const val = e.target.value;
      if (val) {
        handleEvent();
      }
    }
  };

  useEffect(() => {
    setMode(type || LOGIN_STATE.ACCOUNT);
  }, [type, setMode]);

  useEffect(() => {
    if (isExist(Cookie.get("access_token"))) {
      window.location = LOGIN_REDIRECT_PATH;
    }
  }, []);

  useEffect(() => {
    if (mode === LOGIN_STATE.LOGIN) {
      window.location = LOGIN_REDIRECT_PATH;
    }
  }, [mode]);

  return (
    <React.Fragment>
      {mode === LOGIN_STATE.ACCOUNT && (
        <Account
          callback={handleCallback}
          checkEmail={handleCheckEmail}
          onKeyDown={onKeyDown}
          t={t}
        />
      )}
      {mode === LOGIN_STATE.PWD && (
        <Pwd
          email={email}
          callback={handleCallback}
          handleLogin={handleLogin}
          onKeyDown={onKeyDown}
          t={t}
        />
      )}
    </React.Fragment>
  );
};

export default Login;
