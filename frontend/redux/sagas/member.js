import { call, put, takeEvery } from "redux-saga/effects";
import * as memberApi from "../../apis/member";
import * as memberActions from "../../constants/memberTypes";
import * as commonActions from "../../constants/commonTypes";
import toast from "../../constants/toast";

export function* getContacts() {
  try {
    const resp = yield call(memberApi.getContacts);

    if (resp.error_code && resp.error_message) {
      yield put({ type: memberActions.GET_CONTACTS_FAL });
    } else {
      yield put({
        type: memberActions.GET_CONTACTS_SUC,
        payload: { contacts: resp.data },
      });
    }
  } catch (err) {
    yield put({ type: memberActions.GET_CONTACTS_FAL });
  }
}

export function* delContact({ payload }) {
  try {
    const resp = yield call(memberApi.delContact, payload);

    if (resp.error_code && resp.error_message) {
      yield put({ type: memberActions.DEL_CONTACT_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
    } else {
      yield put({ type: memberActions.DEL_CONTACT_SUC });
      yield put({ type: memberActions.GET_CONTACTS });
    }
  } catch (err) {
    yield put({ type: memberActions.DEL_CONTACT_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

const eventListeners = [
  takeEvery(memberActions.GET_CONTACTS, getContacts),
  takeEvery(memberActions.DEL_CONTACT, delContact),
];
export default eventListeners;
