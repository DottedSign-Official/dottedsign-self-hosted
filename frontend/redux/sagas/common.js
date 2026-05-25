import { call, put, takeEvery } from "redux-saga/effects";
import * as othersApi from "../../apis/others";
import * as commonActions from "../../constants/commonTypes";

export function* getCountries() {
  try {
    const res = yield call(othersApi.getCountries);
    if (res?.data) {
      yield put({ type: commonActions.GET_COUNTRIES_SUC, payload: res?.data });
    } else {
      throw res;
    }
  } catch (error) {
    console.log(error);
  }
}
const eventListeners = [takeEvery(commonActions.GET_COUNTRIES, getCountries)];
export default eventListeners;
