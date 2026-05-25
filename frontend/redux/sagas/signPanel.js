import Cookie from "js-cookie";
import queryString from "query-string";
import { put, call, takeEvery } from "redux-saga/effects";
import * as mobilePanelActions from "../../constants/signPanelTypes";
import * as otherApi from "../../apis/others";
import getAPIHost from "../../helpers/getAPIHost";

function* shortenLink({ data }) {
  try {
    const accessToken = Cookie.get("access_token");
    const { language, ...res } = data;
    const stringified = queryString.stringify(
      { ...res, accessToken },
      {
        arrayFormat: "bracket",
      },
    );
    const apiHost = getAPIHost();
    const targetURL = `${apiHost}/${language}/mobile-sign-panel?${stringified}`;

    const resp = yield call(otherApi.shortenLink, {
      target_url: targetURL,
      code: data.code,
      form_token: data.form_token,
    });
    if (resp.data) {
      const { shorten_link } = resp.data;
      yield put({
        type: mobilePanelActions.SET_MOBILE_PANEL_URL_SUC,
        payload: { qrcodeURL: shorten_link },
      });
    } else {
      yield put({ type: mobilePanelActions.SET_MOBILE_PANEL_URL_FAL });
    }
  } catch (e) {
    yield put({ type: mobilePanelActions.SET_MOBILE_PANEL_URL_FAL });
  }
}

const eventListeners = [
  takeEvery(mobilePanelActions.SET_MOBILE_PANEL_URL, shortenLink),
];
export default eventListeners;
