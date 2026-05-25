import { take, call, put, takeEvery } from "redux-saga/effects";
import * as authApi from "../../apis/auth";
import * as memberApi from "../../apis/member";
import * as authActions from "../../constants/authTypes";
import * as signActions from "../../constants/signTypes";
import * as commonActions from "../../constants/commonTypes";
import * as previewActions from "../../constants/previewTypes";
import * as createActions from "../../constants/createTypes";
import toastStatus from "../../constants/toast";
import { openModal } from "../actions/common";
import { MODAL_TYPE } from "../../constants/constants";

function* putUserLanguage({ user }) {
  const userResponse = yield call(authApi.putUser, user);
  if (userResponse.data) {
    yield put({
      type: authActions.SET_USER,
      payload: { user: userResponse.data },
    });
  } else {
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.accountUpdateFal,
    });
    yield take(commonActions.CLOSE_TOAST);
  }
}

function* putUser({ user }) {
  function* openFailedToast() {
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.accountUpdateFal,
    });
    yield take(commonActions.CLOSE_TOAST);
  }
  try {
    const { name, lang, avatar } = user;

    const userResponse = yield call(authApi.putUser, { name, lang });
    if (userResponse.data) {
      yield put({
        type: authActions.SET_USER,
        payload: {
          user: userResponse.data,
        },
      });
    } else {
      yield call(openFailedToast);
    }

    const postAvatarResponse = avatar
      ? yield call(memberApi.postAvatarUpload, {
          data: { file: avatar },
        })
      : null;

    if (avatar && !postAvatarResponse.data) {
      yield call(openFailedToast);
    } else if (avatar) {
      const base64Image = avatar[0].raw;
      const icon_url = `data:image/png;base64,${base64Image}`;
      yield put({
        type: authActions.SET_USER,
        payload: { user: { icon_url, confirmed: true } },
      });
    }

    if (userResponse.data && (!avatar || postAvatarResponse.data)) {
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.accountUpdateSuc,
      });
      yield put({ type: authActions.PUT_USER_SUC });
    } else {
      yield put({ type: authActions.PUT_USER_FAL });
    }
  } catch (error) {
    console.log(error);
    yield call(openFailedToast);
    yield put({ type: authActions.PUT_USER_FAL });
  }
}

function* putPassword({ passwords }) {
  try {
    const resp = yield call(authApi.putPassword, passwords);
    if (resp.data) {
      yield put({ type: authActions.PUT_PASSWORD_SUC });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.updatePasswordSuc,
      });
    } else {
      throw resp;
    }
  } catch (error) {
    let errors = {};
    let payload = toastStatus.updatePasswordFal;
    const ERROR = "invalid_password";
    switch (error?.error_code) {
      case 401209:
        payload = toastStatus.updatePasswordFalInconsistent;
        errors.confirmPassword = ERROR;
        break;
      case 401210:
        payload = toastStatus.updatePasswordFalTheSame;
        errors.newPassword = ERROR;
        break;
      case 401204:
        payload = toastStatus.updatePasswordFalWrong;
        errors.oldPassword = ERROR;
        break;
    }
    yield put({ type: authActions.PUT_PASSWORD_FAL });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload,
    });

    yield take(commonActions.CLOSE_TOAST);
    const { old_password, password, password_confirmation } = passwords;
    yield put(
      openModal({
        modalType: MODAL_TYPE.accountChangePassword,
        modalData: {
          oldPassword: old_password,
          password,
          passwordConfirm: password_confirmation,
          errors,
        },
      }),
    );
  }
}

function* getProfile() {
  try {
    const res = yield call(authApi.getProfile);
    yield put({ type: authActions.GET_PROFILE_SUC, payload: res.data });
  } catch (error) {
    yield put({ type: authActions.GET_PROFILE_FAL });
  }
}

function* putProfile({ profile }) {
  try {
    yield call(authApi.putProfile, profile);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.profileUpdateSuc,
    });
    yield put({ type: authActions.PUT_PROFILE_SUC });
    yield put({ type: authActions.GET_PROFILE });
  } catch (error) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.profileUpdateFal,
    });
    yield put({ type: authActions.PUT_PROFILE_FAL });
  }
}

function* putPreference({ data }) {
  try {
    const regPhone = /(\d{9})/;
    let toTransfer;

    if (data.otp_via_phone) {
      if (
        !data.phone_number ||
        (data.phone_number && data.phone_number.length < 1) ||
        (data.phone_number && !data.phone_number.match(regPhone))
      ) {
        yield put({ type: authActions.PUT_PREFERENCE_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.preferenceUpdateFal,
        });
        return;
      }
      toTransfer = { ...data };
    } else {
      toTransfer = {
        ...data,
        phone_code: null,
        phone_number: null,
      };
    }

    const resp = yield call(authApi.putPreference, toTransfer);

    if (resp.error_code) {
      yield put({ type: authActions.PUT_PREFERENCE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.preferenceUpdateFal,
      });
    } else {
      yield put({
        type: authActions.SET_USER,
        payload: { user: resp.data },
      });
      yield put({ type: authActions.PUT_PREFERENCE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.preferenceUpdateSuc,
      });
    }
  } catch (error) {
    yield put({ type: authActions.PUT_PREFERENCE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.preferenceUpdateFal,
    });
  }
}

function* resendRequest() {
  try {
    const res = yield call(authApi.resendRequest);

    if (res.data) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.sendRequestSuc,
      });
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.sendRequestFal,
      });
    }
  } catch (error) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.sendRequestFal,
    });
  }
}

function* clearFrontDesk() {
  try {
    yield put({ type: previewActions.RESET_PREVIEW });
    yield put({ type: createActions.RESET_CREATE });
    yield put({ type: signActions.RESET_SIGN });
  } catch (err) {
    console.log(err);
  }
}

function* clearPublicForm() {
  try {
    yield put({ type: createActions.RESET_CREATE });
    yield put({ type: signActions.RESET_SIGN });
  } catch (err) {
    console.log(err);
  }
}

const eventListeners = [
  takeEvery(authActions.PUT_USER, putUser),
  takeEvery(authActions.PUT_USER_LANGUAGE, putUserLanguage),
  takeEvery(authActions.PUT_PASSWORD, putPassword),
  takeEvery(authActions.GET_PROFILE, getProfile),
  takeEvery(authActions.PUT_PROFILE, putProfile),
  takeEvery(authActions.PUT_PREFERENCE, putPreference),
  takeEvery(authActions.RESEND_REQUEST, resendRequest),
  takeEvery(authActions.CLEAR_FRONT_DESK, clearFrontDesk),
  takeEvery(authActions.CLEAR_PUBLIC_FORM, clearPublicForm),
];
export default eventListeners;
