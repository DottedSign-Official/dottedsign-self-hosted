import { call, put, takeEvery } from "redux-saga/effects";
import * as memberApi from "../../apis/member";
import * as memberActions from "../../constants/memberTypes";

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
const eventListeners = [takeEvery(memberActions.GET_CONTACTS, getContacts)];
export default eventListeners;
