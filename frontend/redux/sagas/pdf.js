import { call, put, takeEvery } from "redux-saga/effects";

import * as pdfActions from "../../constants/pdfTypes";
import getAllViewport from "../../helpers/getViewport";

function* setDocument({ doc }) {
  try {
    const result = yield call(getAllViewport, doc);

    if (!result) {
      return;
    }

    yield put({ type: pdfActions.SET_VIEWPORT, payload: result });
  } catch (err) {
    console.log(err);
  }
}
const eventListeners = [takeEvery(pdfActions.SET_DOCUMENT, setDocument)];
export default eventListeners;
