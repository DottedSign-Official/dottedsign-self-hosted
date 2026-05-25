import { call, put, takeEvery } from "redux-saga/effects";
import Cookies from "js-cookie";
import { setTokenCookies } from "../../helpers/cookies";
import * as loginActions from "../../constants/loginTypes";
import * as commonActions from "../../constants/commonTypes";
import * as loginApi from "../../apis/login";
import toastStatus from "../../constants/toast";

export function* login({ payload }) {
  try {
    const res = yield call(loginApi.login, payload);
    if (res.error_code) {
      yield put({ type: loginActions.LOGIN_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.loginFal,
      });
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    } else {
      yield put({ type: loginActions.LOGIN_SUC });
      if (res.access_token) {
        const { access_token, refresh_token, expires_in } = res;
        setTokenCookies(access_token, refresh_token, expires_in);
      }
    }
  } catch (error) {
    yield put({ type: loginActions.LOGIN_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export function* register({ payload }) {
  try {
    const toastErrorTypes = {
      402001: toastStatus.registerFal,
      400201: toastStatus.invalidDomain,
      400220: toastStatus.invalidDomain,
    };
    const res = yield call(loginApi.register, payload);
    if (res.error_code) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastErrorTypes[res.error_code] || toastStatus.commonError,
      });
      yield put({ type: loginActions.REGSITER_FAL });
    } else {
      yield put({ type: loginActions.REGSITER_SUC });
    }
  } catch (error) {
    yield put({ type: loginActions.REGSITER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export function* forgetPwd({ data }) {
  try {
    const res = yield call(loginApi.forgetPwd, data);
    if (res.error_code) {
      yield put({ type: loginActions.FORGET_PWD_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.checkMailFal,
      });
    } else {
      yield put({ type: loginActions.FORGET_PWD_SUC });
    }
  } catch (error) {
    yield put({ type: loginActions.FORGET_PWD_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export function* resetPwd({ payload }) {
  try {
    const res = yield call(loginApi.resetPwd, payload);
    if (res.error_code) {
      yield put({ type: loginActions.RESET_PWD_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.resetFal,
      });
    } else {
      yield put({ type: loginActions.RESET_PWD_SUC });
    }
  } catch (error) {
    yield put({ type: loginActions.RESET_PWD_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}
const eventListeners = [
  takeEvery(loginActions.LOGIN, login),
  takeEvery(loginActions.REGSITER, register),
  takeEvery(loginActions.FORGET_PWD, forgetPwd),
  takeEvery(loginActions.RESET_PWD, resetPwd),
];

export default eventListeners;
