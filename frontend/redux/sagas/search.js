import { call, put, takeEvery } from "redux-saga/effects";
import * as searchApi from "../../apis/search";
import * as searchActions from "../../constants/searchTypes";
// NOTE: import { TASKS_PER_PAGE } from "../../constants/constants";

export function* getTasksSearch({ payload }) {
  try {
    const payloadManified = Object.assign({}, payload, {
      per_page: 8,
    });
    const res = yield call(searchApi.getTasksSearch, payloadManified);

    if (res.error_code) {
      yield put({ type: searchActions.GET_TASKS_SEARCH_FAL });
    } else {
      let allTasks = res.data.tasks;
      allTasks.sort((a, b) => {
        const keyA = a.created_at || a.modified_at;
        const keyB = b.created_at || b.modified_at;
        if (keyA < keyB) {
          return 1;
        }
        if (keyA > keyB) {
          return -1;
        }
        return 0;
      });

      yield put({
        type: searchActions.GET_TASKS_SEARCH_SUC,
        payload: {
          currentPage: res.data.current_page,
          totalPages: res.data.total_pages,
          totalTasks: res.data.total_count,
          tasksSearch: allTasks,
        },
      });
    }
  } catch (err) {
    yield put({ type: searchActions.GET_TASKS_SEARCH_FAL });
  }
}

export function* getTaskSearchDeveloper({ payload }) {
  try {
    const res = yield call(searchApi.getTasksSearchDeveloper, payload);

    if (res.error_code) {
      yield put({ type: searchActions.GET_TASKS_SEARCH_DEVELOPER_FAL });
    } else {
      yield put({
        type: searchActions.GET_TASKS_SEARCH_DEVELOPER_SUC,
        payload: {
          tasksSearchDeveloper: res.data,
          taskDeveloper: null,
        },
      });
    }
  } catch (err) {
    yield put({ type: searchActions.GET_TASKS_SEARCH_FAL });
  }
}

function* getTaskSearchDeveloperDetail({ payload }) {
  try {
    const res = yield call(searchApi.getSearchTaskId, payload);

    if (res.error_code) {
      yield put({ type: searchActions.GET_TASKS_SEARCH_DEVELOPER_DETAIL_FAL });
    } else {
      yield put({
        type: searchActions.GET_TASKS_SEARCH_DEVELOPER_DETAIL_SUC,
        payload: {
          tasksSearchDeveloper: null,
          taskDeveloper: res.data,
        },
      });
    }
  } catch (err) {
    yield put({ type: searchActions.GET_TASKS_SEARCH_DEVELOPER_DETAIL_FAL });
  }
}

const eventListeners = [
  takeEvery(searchActions.GET_TASKS_SEARCH, getTasksSearch),
  takeEvery(searchActions.GET_TASKS_SEARCH_DEVELOPER, getTaskSearchDeveloper),
  takeEvery(
    searchActions.GET_TASKS_SEARCH_DEVELOPER_DETAIL,
    getTaskSearchDeveloperDetail,
  ),
];
export default eventListeners;
