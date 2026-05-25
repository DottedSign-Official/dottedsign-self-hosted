import { call, put, takeEvery } from "redux-saga/effects";
import * as acceptApi from "../../apis/accept";
import * as actions from "../../constants/acceptTypes";
import { ACCEPT_STATUS } from "../../constants/constants";

export function* postAccept({ data }) {
  try {
    const res = yield call(acceptApi.postAccept, data);

    if (res.data) {
      yield put({
        type: actions.POST_ACCEPTANCE_SUC,
        payload: { status: ACCEPT_STATUS.acceptSuc },
      });
    } else if (res.error_code) {
      let status;
      if (res.error_code === 4001304) {
        status = ACCEPT_STATUS.accepted;
      }
      if (res.error_code === 4001305) {
        status = ACCEPT_STATUS.acceptFal;
      }
      if (res.error_code === 4001306) {
        status = ACCEPT_STATUS.needRegisterFirst;
      }
      if (res.error_code === 4001307 || res.error_code === 4041301) {
        status = ACCEPT_STATUS.tokenInvalid;
      }
      if (res.error_code === 4001308) {
        status = ACCEPT_STATUS.overGroupLimit;
      }

      yield put({
        type: actions.POST_ACCEPTANCE_FAL,
        payload: { status, error: res },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: actions.POST_ACCEPTANCE_FAL, payload: { error } });
  }
}
const eventListeners = [takeEvery(actions.POST_ACCEPTANCE, postAccept)];
export default eventListeners;
