import { call, put, takeEvery } from "redux-saga/effects";
import * as settingsApi from "../../apis/settings";
import * as settingsActions from "../../constants/settingsTypes";
import * as commonActions from "../../constants/commonTypes";
import toast from "../../constants/toast";
import { getApiSigners } from "../../helpers/signingGroup";
import { isEmail } from "../../helpers/utility";

export function* getBulks({ data }) {
  try {
    const res = yield call(settingsApi.getBulks, data);

    if (res.error_code) {
      yield put({ type: settingsActions.GET_BULKS_FAL });
      return;
    }
    yield put({
      type: settingsActions.GET_BULKS_SUC,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    yield put({ type: settingsActions.GET_BULKS_FAL });
  }
}

function* getSigningGroup({ data }) {
  try {
    const resp = yield call(settingsApi.getSigningGroup, data);

    if (resp.error_code) {
      yield put({ type: settingsActions.GET_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
      return;
    }

    const combinations =
      resp.data.combinations?.map((group) => ({
        ...group,
        details:
          group.details?.map((stg, idx) => ({
            ...stg,
            key: idx,
            uid: stg.stage_id,
          })) || [],
      })) || [];

    const payload = {
      ...resp.data,
      combinations,
    };

    yield put({
      type: settingsActions.GET_SIGNING_GROUP_SUC,
      payload,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: settingsActions.GET_SIGNING_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

function* postSigningGroup({ data }) {
  try {
    const { onCloseCache, stages, ...res } = data;

    if (!res.name || res.name.length < 1) {
      yield put({ type: settingsActions.POST_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.invalidName,
      });
      return;
    }

    const isStagesInValid =
      stages.filter((stage) => {
        if (!stage.name || stage.name.length < 1) {
          return true;
        }
        if (!stage.email || stage.email.length < 1) {
          return false;
        }
        if (!isEmail(stage.email)) {
          return true;
        }
        return false;
      }).length > 0;

    if (isStagesInValid) {
      yield put({ type: settingsActions.POST_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.invalidSigner,
      });
      return;
    }

    const newStages = yield call(getApiSigners, stages);
    const payload = {
      ...res,
      stages: newStages,
    };

    const resp = yield call(settingsApi.postSigningGroup, payload);

    if (resp.error_code) {
      yield put({ type: settingsActions.POST_SIGNING_GROUP_FAL });

      if (resp.error_code === 400201) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.emailDomainError,
        });
        return;
      }

      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.emailFormatError,
        });
        return;
      }

      if (resp.error_code === 400417) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.invalidInputError,
        });
        return;
      }

      if (resp.error_code === 400428) {
        // NOTE: authentication setting failed
        yield put({
          type: commonActions.OPEN_TOAST,
          payload:
            resp?.error_source === "editor"
              ? toast.authenticationConflict
              : toast.authenticationNotAllowed,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
      return;
    }

    yield put({
      type: settingsActions.POST_SIGNING_GROUP_SUC,
      payload: resp.data,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.postSigningGroupSuc,
    });
    yield put({
      type: settingsActions.GET_SIGNING_GROUP,
      data: { page: 1 },
    });

    if (onCloseCache) {
      yield call(onCloseCache);
    }
  } catch (err) {
    console.log(err);
    yield put({ type: settingsActions.POST_SIGNING_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

function* putSigningGroup({ data }) {
  try {
    const { onCloseCache, stages, ...res } = data;

    if (!res.name || res.name.length < 1) {
      yield put({ type: settingsActions.PUT_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.invalidName,
      });
      return;
    }

    let payload = { ...res };

    if (stages?.length > 0) {
      const isStagesInValid =
        stages.filter((stage) => {
          if (!stage.name || stage.name.length < 1) {
            return true;
          }
          if (!stage.email || stage.email.length < 1) {
            return false;
          }
          if (!isEmail(stage.email)) {
            return true;
          }
          return false;
        }).length > 0;

      if (isStagesInValid) {
        yield put({ type: settingsActions.PUT_SIGNING_GROUP_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.invalidSigner,
        });
        return;
      }

      const newStages = yield call(getApiSigners, stages);

      payload = {
        ...res,
        stages: newStages,
      };
    }

    const resp = yield call(settingsApi.putSigningGroup, payload);

    if (resp.error_code) {
      yield put({ type: settingsActions.PUT_SIGNING_GROUP_FAL });

      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.emailFormatError,
        });
        return;
      }
      if (resp.error_code === 400201) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toast.invalidDomain,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
      return;
    }

    yield put({
      type: settingsActions.PUT_SIGNING_GROUP_SUC,
      payload: resp.data,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.putSigningGroupSuc,
    });
    yield put({
      type: settingsActions.SET_SIGNING_GROUP_CURRENT_PAGE,
      payload: 1,
    });
    yield put({
      type: settingsActions.GET_SIGNING_GROUP,
      data: { page: 1 },
    });

    if (onCloseCache) {
      yield call(onCloseCache);
    }
  } catch (err) {
    console.log(err);
    yield put({ type: settingsActions.PUT_SIGNING_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

function* delSigningGroup({ data }) {
  try {
    const resp = yield call(settingsApi.delSigningGroup, data);

    if (resp.error_code) {
      yield put({ type: settingsActions.DEL_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
      return;
    }

    yield put({
      type: settingsActions.DEL_SIGNING_GROUP_SUC,
      payload: resp.data,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.delSigningGroupSuc,
    });
    yield put({
      type: settingsActions.GET_SIGNING_GROUP,
      data: { page: 1 },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: settingsActions.DEL_SIGNING_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

function* postShareSigningGroup({ data }) {
  try {
    const resp = yield call(settingsApi.postShareSigningGroup, data);

    if (resp.error_code) {
      yield put({ type: settingsActions.POST_SHARE_SIGNING_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toast.commonError,
      });
      return;
    }

    yield put({
      type: settingsActions.POST_SHARE_SIGNING_GROUP_SUC,
      payload: resp.data,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.postShareSigningGroupSuc,
    });
    yield put({
      type: settingsActions.GET_SIGNING_GROUP,
      data: { page: 1 },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: settingsActions.POST_SHARE_SIGNING_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toast.commonError,
    });
  }
}

const eventListeners = [
  takeEvery(settingsActions.GET_BULKS, getBulks),
  takeEvery(settingsActions.GET_SIGNING_GROUP, getSigningGroup),
  takeEvery(settingsActions.POST_SIGNING_GROUP, postSigningGroup),
  takeEvery(settingsActions.PUT_SIGNING_GROUP, putSigningGroup),
  takeEvery(settingsActions.DEL_SIGNING_GROUP, delSigningGroup),
  takeEvery(settingsActions.POST_SHARE_SIGNING_GROUP, postShareSigningGroup),
];
export default eventListeners;
