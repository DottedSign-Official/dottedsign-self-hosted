import { call, put, takeEvery, select } from "redux-saga/effects";
import * as developerApi from "../../apis/developer";
import * as developerActions from "../../constants/developerTypes";
import * as commonActions from "../../constants/commonTypes";
import * as searchActions from "../../constants/searchTypes";
import toastStatus from "../../constants/toast";

function* retryCA({ payload }) {
  try {
    const res = yield call(developerApi.retryCA, { sign_task_id: payload });

    if (!res?.data) {
      throw res;
    }

    yield put({
      type: developerActions.RETRY_CA_SUC,
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      data: {
        text: "retry_ca_suc",
        isWarning: false,
      },
    });
  } catch (error) {
    yield put({
      type: developerActions.RETRY_CA_FAL,
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      data: {
        text: "retry_ca_failed",
        isWarning: true,
      },
    });
    console.log(error);
  }
}

function* getAllMembers({ payload }) {
  try {
    const payloadMinified = {
      filter_status: payload?.filterStatus, // NOTE: active or inactive
      filter_none_group: payload?.filterNoneGroup, // NOTE: boolean
      search_email: payload?.searchEmail,
      search_group_name: payload?.searchGroupName,
      page: payload?.page || 1,
      per_page: 10,
    };

    const resp = yield call(developerApi.getAllMembers, payloadMinified);

    if (resp.error_code) {
      yield put({ type: developerActions.GET_ALL_MEMBERS_FAL });
    } else {
      yield put({
        type: developerActions.GET_ALL_MEMBERS_SUC,
        payload: {
          currentPage: resp.data.current_page,
          totalPages: resp.data.total_pages,
          members: resp.data.members,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* modifyMemberStatus({ payload }) {
  try {
    const getCurrentPage = (state) => state.developer.currentPage;
    const currentPage = yield select(getCurrentPage);

    const { email, status, searchEmail, filterStatus, searchGroupName } =
      payload;
    const payloadMinified = { email, status };

    const resp = yield call(developerApi.modifyMemberStatus, payloadMinified);

    if (resp.error_code) {
      yield put({ type: developerActions.MODIFY_MEMBER_STATUS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    } else {
      yield put({ type: developerActions.MODIFY_MEMBER_STATUS_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.updateMemberStatusSuc,
      });
      yield call(getAllMembers, {
        payload: {
          searchEmail,
          filterStatus,
          searchGroupName,
          page: currentPage,
        },
      });
      yield put({ type: commonActions.CLOSE_MODAL });
    }
  } catch (err) {
    console.log(err);
  }
}

function* getAllGroups({ payload }) {
  try {
    const payloadMinified = {
      page: payload?.page || 1,
      per_page: 10,
    };

    const resp = yield call(developerApi.getAllGroups, payloadMinified);

    if (resp.error_code) {
      yield put({ type: developerActions.GET_ALL_GROUPS_FAL });
    } else {
      yield put({
        type: developerActions.GET_ALL_GROUPS_SUC,
        payload: {
          currentPage: resp.data.current_page,
          totalPages: resp.data.total_pages,
          groups: resp.data.groups,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* updateGroup({ payload }) {
  try {
    const { groupId, groupName } = payload;

    const payloadMinified = { group_id: groupId, group_name: groupName };
    const resp = yield call(developerApi.updateGroup, payloadMinified);
    if (!resp.data) {
      throw resp;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      data: { text: "update_group_name_suc" },
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    const { currentPage } = yield select((state) => state.developer);
    yield call(getAllGroups, { payload: { page: currentPage } });
  } catch (e) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* createGroup({ payload }) {
  try {
    const { text } = payload;

    const payloadMinified = { group_name: text };
    const resp = yield call(developerApi.createGroup, payloadMinified);
    if (!resp.data) {
      throw resp;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      data: { text: "create_group_suc" },
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    const { currentPage } = yield select((state) => state.developer);
    yield call(getAllGroups, { payload: { page: currentPage } });
  } catch (e) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* assignGroupMember({ payload }) {
  try {
    const { email, groupId } = payload;
    const payloadMinified = {
      assignee_email: email,
      group_id: groupId,
      role: "member",
    };
    const resp = yield call(developerApi.assignGroupMember, payloadMinified);
    if (!resp.data) {
      throw resp.error_code;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      data: { text: "invite_member_suc" },
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    const { currentPage } = yield select((state) => state.developer);
    yield call(getAllGroups, { payload: { page: currentPage } });
  } catch (errorCode) {
    const errorToastData = {
      4001301: {
        data: { text: "invite_member_already_in_group", isWarning: true },
      },
      404201: { data: { text: "invite_member_not_found", isWarning: true } },
    };

    yield put({
      type: commonActions.OPEN_TOAST,
      ...(errorToastData[errorCode] || { payload: toastStatus.commonError }),
    });
  }
}

function* removeMemberFromGroup({ payload }) {
  try {
    const { groupId, email } = payload;
    const payloadMinified = {
      assignee_email: email,
      group_id: groupId,
    };
    const resp = yield call(
      developerApi.removeMemberFromGroup,
      payloadMinified,
    );
    if (!resp.data) {
      throw resp;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      data: { text: "remove_member_suc" },
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    const { currentPage } = yield select((state) => state.developer);
    yield call(getAllGroups, { payload: { page: currentPage } });
  } catch (e) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putMemberRole({ payload }) {
  const { role, email } = payload;
  const payloadMinified = {
    assignee_email: email,
    roles: [role],
  };
  const resp = yield call(developerApi.putMemberRole, payloadMinified);
  if (resp.data) {
    yield put({
      type: commonActions.OPEN_TOAST,
      data: { text: "put_member_role_suc" },
    });
    const { currentPage } = yield select((state) => state.developer);
    yield call(getAllGroups, { payload: { page: currentPage } });
    return true;
  } else {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
    return false;
  }
}

function* getSidekiqRetryList() {
  try {
    const resp = yield call(developerApi.getSidekiqRetryList);

    if (resp.error_code) {
      yield put({ type: developerActions.GET_SIDEKIQ_RETRY_LIST_FAL });
    } else {
      yield put({
        type: developerActions.GET_SIDEKIQ_RETRY_LIST_SUC,
        payload: {
          sidekiqRetryList: resp.data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* postDeveloperRollback({ payload }) {
  try {
    const resp = yield call(developerApi.postDeveloperRollback, payload);
    if (resp.error_code) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postReissueTaskFal,
      });
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postReissueTaskSuc,
      });
      yield put({
        type: searchActions.GET_TASKS_SEARCH_DEVELOPER,
        payload: { page: 1 },
      });
    }
  } catch (e) {
    console.log(e);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

const eventListeners = [
  takeEvery(developerActions.GET_ALL_MEMBERS, getAllMembers),
  takeEvery(developerActions.MODIFY_MEMBER_STATUS, modifyMemberStatus),
  takeEvery(developerActions.GET_ALL_GROUPS, getAllGroups),
  takeEvery(developerActions.UPDATE_GROUP, updateGroup),
  takeEvery(developerActions.CREATE_GROUP, createGroup),
  takeEvery(developerActions.PUT_MEMBER_ROLE, putMemberRole),
  takeEvery(developerActions.REMOVE_MEMBER_FROM_GROUP, removeMemberFromGroup),
  takeEvery(developerActions.ASSIGN_GROUP_MEMBER, assignGroupMember),
  takeEvery(developerActions.RETRY_CA, retryCA),
  takeEvery(developerActions.GET_SIDEKIQ_RETRY_LIST, getSidekiqRetryList),
  takeEvery(developerActions.POST_DEVELOPER_ROLLBACK, postDeveloperRollback),
];

export default eventListeners;
