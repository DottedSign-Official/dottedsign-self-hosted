import { call, put, takeEvery } from "redux-saga/effects";
import * as licenseApi from "../../apis/license";
import * as licenseAction from "../../constants/licenseTypes";

export function* getLicense() {
  try {
    const resp = yield call(licenseApi.getLicense);

    if (resp.error_code) {
      yield put({ type: licenseAction.GET_LICENSE_FAL });
    } else {
      yield put({ type: licenseAction.GET_LICENSE_SUC, payload: resp.data });
    }
  } catch (err) {
    yield put({ type: licenseAction.GET_LICENSE_FAL });
  }
}
const eventListeners = [takeEvery(licenseAction.GET_LICENSE, getLicense)];
export default eventListeners;
