import { call, put, select, delay, takeEvery } from "redux-saga/effects";
import * as labelApi from "../../apis/label";
import * as commonActions from "../../constants/commonTypes";
import * as labelActions from "../../constants/labelTypes";
import * as templateActions from "../../constants/templateTypes";
import * as signActions from "../../constants/signTypes";
import * as searchActions from "../../constants/searchTypes";
import toastStatus from "../../constants/toast";
import Router from "next/router";

export function* getLabels({ payload } = {}) {
  try {
    const resp = yield call(labelApi.getLabels, payload || {});

    if (resp.error_code) {
      yield put({ type: labelActions.GET_LABELS_FAL });
    } else {
      yield put({ type: labelActions.GET_LABELS_SUC, payload: resp.data });
    }
  } catch (err) {
    yield put({ type: labelActions.GET_LABELS_FAL });
  }
}

export function* createLabel({ payload }) {
  try {
    const resp = yield call(labelApi.createLabel, { new_tag: payload });

    if (resp.error_code) {
      yield put({ type: labelActions.CREATE_LABEL_FAL });

      // NOTE: duplicated
      if (resp.error_code === 400054) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.labelDuplicatedFailed,
        });

        return null;
      }

      // NOTE: too long
      if (resp.error_code === 400064) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.labelTooLongFailed,
        });

        return null;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.createLabelFailed,
      });
    } else {
      yield put({ type: labelActions.GET_LABELS_SUC, payload: resp.data });
      yield put({
        type: commonActions.OPEN_TOAST,
        data: {
          text: "create_label_Suc",
          isWarning: false,
        },
      });
    }

    yield put({ type: commonActions.CLOSE_MODAL });
  } catch (err) {
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: labelActions.CREATE_LABEL_FAL });
  }
}

export function* putLabel({ payload }) {
  try {
    const { newLabel, oldLabel } = payload;

    const resp = yield call(labelApi.putLabel, {
      new_tag: newLabel,
      old_tag: oldLabel,
    });

    if (resp.error_code) {
      yield put({ type: labelActions.PUT_LABEL_FAL });

      // NOTE: duplicated
      if (resp.error_code === 400054) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.labelDuplicatedFailed,
        });
      } else if (
        // NOTE: too long
        resp.error_code === 400064
      ) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.labelTooLongFailed,
        });

        return null;
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putLabelFal,
        });
      }
    } else {
      yield put({ type: labelActions.GET_LABELS_SUC, payload: resp.data });
      yield put({
        type: commonActions.OPEN_TOAST,
        data: {
          text: "put_label_Suc",
          isWarning: false,
        },
      });
    }
    yield put({ type: commonActions.CLOSE_MODAL });
  } catch (err) {
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: labelActions.PUT_LABEL_FAL });
  }
}

export function* delLabel({ payload }) {
  try {
    const resp = yield call(labelApi.delLabel, { remove_tag: payload });

    if (resp.error_code) {
      yield put({ type: labelActions.DEL_LABEL_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.delLabelFailed,
      });
    } else {
      yield put({ type: labelActions.GET_LABELS_SUC, payload: resp.data });
      yield put({
        type: commonActions.OPEN_TOAST,
        data: {
          text: "del_label_Suc",
          isWarning: false,
        },
      });
    }
    yield put({ type: commonActions.CLOSE_MODAL });
  } catch (err) {
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: labelActions.DEL_LABEL_FAL });
  }
}

function* manageLabel({ payload }) {
  const { taggable_type } = payload;

  try {
    const resp = yield call(labelApi.manageLabel, payload);

    if (resp.error_code || !resp.data) {
      yield put({ type: labelActions.MANAGE_LABEL_FAL });
      return;
    }

    yield delay(1500);

    const isSignTaskOrEnvelope =
      taggable_type === "SignTask" || taggable_type === "Envelope";
    const isTasksPage = () => Router.pathname.includes("/tasks");
    const isTaskPage = () => Router.pathname.includes("/task");
    const isSearchPage = () => Router.pathname.includes("/search");
    const isPublicFormsPage = () => Router.pathname.includes("/public-forms");

    if (taggable_type === "Template") {
      yield put({
        type: templateActions.MANAGE_TEMPLATE_LABEL,
        payload: {},
      });
    } else if (isSignTaskOrEnvelope && isTasksPage()) {
      const getSign = (state) => state.sign;
      const sign = yield select(getSign);
      const { filter, focus, focusPage } = sign;

      const cond = {
        category: focus,
        page: focusPage,
      };
      if (filter) {
        cond.filter = filter;
      }

      yield put({
        type: signActions.GET_TASKS,
        payload: cond,
      });
    } else if (taggable_type === "SignTask" && isPublicFormsPage()) {
      yield put({
        type: signActions.GET_PUBLIC_FORM_TASKS,
        payload: {},
      });
    } else if (isSignTaskOrEnvelope && isTaskPage()) {
      const { code, token, taskId } = Router.query;
      const data = token
        ? { token }
        : taskId
        ? { taskId }
        : code
        ? { code }
        : null;

      yield put({
        type: signActions.GET_SIGN_TASK,
        data,
      });
    } else if (
      taggable_type === "Batch" ||
      (isSignTaskOrEnvelope && isSearchPage())
    ) {
      const getSearch = (state) => state.search;
      const search = yield select(getSearch);

      const { currentTab, keyword, dateStart, dateEnd, currentPage, labels } =
        search;

      const defaultSearchParam = {
        target: currentTab,
        terms: keyword,
        page: currentPage || 1,
        start_from: dateStart,
        end_at: dateEnd,
        search_tags: labels,
      };

      yield put({
        type: searchActions.GET_TASKS_SEARCH,
        payload: defaultSearchParam,
      });
    } else {
      throw new Error(`Unhandled taggable_type: ${taggable_type}`);
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.manageLabelSuc,
    });
    yield put({ type: commonActions.CLOSE_MODAL });

    yield put({ type: labelActions.MANAGE_LABEL_SUC });
  } catch (err) {
    yield put({ type: labelActions.MANAGE_LABEL_FAL });
  }
}

const eventListeners = [
  takeEvery(labelActions.GET_LABELS, getLabels),
  takeEvery(labelActions.CREATE_LABEL, createLabel),
  takeEvery(labelActions.PUT_LABEL, putLabel),
  takeEvery(labelActions.DEL_LABEL, delLabel),
  takeEvery(labelActions.MANAGE_LABEL, manageLabel),
];

export default eventListeners;
