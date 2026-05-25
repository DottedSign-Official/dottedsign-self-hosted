import { call, put, takeEvery } from "redux-saga/effects";
import * as verifyApi from "../../apis/verify";
import * as actions from "../../constants/verifyTypes";

export function* postVerify({ data }) {
  try {
    const res = yield call(verifyApi.postVerify, data);

    // NOTE: token invalid
    if (res.error_code && res.error_code === 400002) {
      yield put({ type: actions.POST_VERIFY_FAL });
    } else {
      yield put({ type: actions.POST_VERIFY_SUC });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: actions.POST_VERIFY_FAL });
  }
}

const eventListeners = [takeEvery(actions.POST_VERIFY, postVerify)];

export default eventListeners;
