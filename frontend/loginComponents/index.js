import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  login,
  register,
  forgetPwd,
  resetPwd,
  setMode,
} from "../redux/actions/login";
import { openToast } from "../redux/actions/common";
import { LOGIN_STATE } from "../constants/constants";
import Default from "./status/default";
import ResetPwd from "./resetPwd";
import Signup from "./status/signup";
import ForgetPwd from "./status/forgetPwd";
import LDAPButton from "./ldapBtn";
import toastStatus from "../constants/toast";
import { isEmail } from "../helpers/utility";
import { getRedirectPath } from "../helpers/auth";

const LOGIN_REDIRECT_PATH = "/";
const Login = ({ type }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.login.isLoading);

  const { t } = useTranslation("login");
  const mode = useSelector((state) => state.login.mode);

  const handleCallback = (value) => dispatch(setMode(value.mode));

  const handleLogin = (data) => dispatch(login(data));

  const handleRegister = (data) => dispatch(register(data));

  const handleOpenToast = (data) => dispatch(openToast(data));

  const handleForgetPwd = (value) => {
    if (!isEmail(value.email)) {
      return handleOpenToast({ payload: toastStatus.invalidEmail });
    }
    dispatch(forgetPwd(value));
  };

  const handleResetPwd = (data) => dispatch(resetPwd(data));

  const onKeyDown = (e, handleEvent) => {
    if (e.keyCode === 13) {
      const val = e.target.value;
      if (val) {
        handleEvent();
      }
    }
  };

  useEffect(() => {
    dispatch(setMode(type || LOGIN_STATE.ACCOUNT));
  }, [type, dispatch]);

  useEffect(() => {
    if (mode === LOGIN_STATE.LOGIN) {
      const redirectPath = getRedirectPath(true);
      window.location = redirectPath || LOGIN_REDIRECT_PATH;
    }
  }, [mode]);

  return (
    <React.Fragment>
      {mode === LOGIN_STATE.ACCOUNT && (
        <Default
          isLoading={isLoading}
          callback={handleCallback}
          handleLogin={handleLogin}
          onKeyDown={onKeyDown}
          t={t}
        >
          <LDAPButton t={t} />
        </Default>
      )}
      {(mode === LOGIN_STATE.SIGNUP || mode === LOGIN_STATE.SIGNUP_SUC) && (
        <Signup
          isRegisterSuc={mode === LOGIN_STATE.SIGNUP_SUC}
          isLoading={isLoading}
          callback={handleCallback}
          register={handleRegister}
          onKeyDown={onKeyDown}
          t={t}
        />
      )}
      {(mode === LOGIN_STATE.FORGET_PWD ||
        mode === LOGIN_STATE.FORGET_MAIL_SEND_SUC) && (
        <ForgetPwd
          isSendMail={mode === LOGIN_STATE.FORGET_MAIL_SEND_SUC}
          isLoading={isLoading}
          callback={handleCallback}
          forgetPwd={handleForgetPwd}
          onKeyDown={onKeyDown}
          t={t}
        />
      )}
      {(mode === LOGIN_STATE.RESET_PWD ||
        mode === LOGIN_STATE.RESET_PWD_SUC) && (
        <ResetPwd
          isResetSuc={mode === LOGIN_STATE.RESET_PWD_SUC}
          callback={handleCallback}
          resetPwd={handleResetPwd}
          onKeyDown={onKeyDown}
          t={t}
        />
      )}
    </React.Fragment>
  );
};

export default Login;
