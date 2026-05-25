import { call, put, takeEvery, select, delay, take } from "redux-saga/effects";
import Router from "next/router";
import * as adminApi from "../../apis/admin";
import * as groupsApi from "../../apis/groups";
import * as adminActions from "../../constants/adminTypes";
import * as commonActions from "../../constants/commonTypes";
import { MODAL_TYPE } from "../../constants/constants";
import toastStatus from "../../constants/toast";

export function* getOrganization() {
  try {
    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);

    if (!user || !user.group_id) {
      yield put({ type: adminActions.GET_ORGANIZATION_FAL });
      return null;
    }

    const res = yield call(adminApi.getOrganization, {
      group_id: user.group_id,
    });

    if (res.error_code) {
      yield put({ type: adminActions.GET_ORGANIZATION_FAL });
    } else {
      const me = res.data.group_members.find((mem) => mem.email === user.email);
      const role = me !== undefined && me.roles[0];

      yield put({
        type: adminActions.GET_ORGANIZATION_SUC,
        payload: {
          role,
          organization: res.data,
        },
      });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: adminActions.GET_ORGANIZATION_FAL });
  }
}

export function* getOrganizationList({ payload }) {
  try {
    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);

    if (!user || !user.group_id) {
      return null;
    }

    const payloadMinified = {
      search_group_name: payload?.searchGroupName || "",
      page: payload?.page || 1,
      per_page: 10,
    };

    const resp = yield call(adminApi.getOrganizationList, payloadMinified);

    if (resp.error_code) {
      throw resp.error_code;
    }

    yield put({
      type: adminActions.GET_ORGANIZATION_LIST_SUC,
      payload: {
        organizationList: resp.data.groups,
        currentOrganizationListPage: resp.data.current_page,
        totalOrganizationListPages: resp.data.total_pages,
        totalOrganizationListCount: resp.data.total_count,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export function* putOrganizationIcon({ user, logo }) {
  if (user?.current_permission?.manage_company_logo) {
    if (logo?.preview && !logo?.file) {
      return;
    }

    const resp = yield call(adminApi.postIcon, {
      group_id: user.group_id,
      group_icon: logo?.file || "",
    });

    if (resp.error_code && resp.error_message) {
      yield put({ type: adminActions.PUT_ORGANIZATION_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putOrganizationLogoFal,
      });
      yield take(commonActions.CLOSE_TOAST);
      return false;
    }
    return true;
  }
}

export function* putOrganizationName({ user, name }) {
  if (user?.current_permission?.manage_company_name) {
    const resp2 = yield call(adminApi.putOrganization, {
      group_id: user.group_id,
      name,
    });

    if (resp2.error_code && resp2.error_message) {
      yield put({ type: adminActions.PUT_ORGANIZATION_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putOrganizationFal,
      });
      yield take(commonActions.CLOSE_TOAST);
      return false;
    }

    return true;
  }
}

function* putOrganization({ payload }) {
  try {
    const { name, logo } = payload;
    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);

    const putIconSuc = yield call(putOrganizationIcon, { user, logo });
    const putNameSuc = yield call(putOrganizationName, { user, name });

    if (putIconSuc || putNameSuc) {
      yield put({ type: adminActions.PUT_ORGANIZATION_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putOrganizationSuc,
      });

      yield put({ type: adminActions.GET_ORGANIZATION });
      yield put({ type: commonActions.CLOSE_MODAL });
    } else {
      yield put({ type: adminActions.PUT_ORGANIZATION_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putOrganizationFal,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
    }
  } catch (err) {
    console.log(err);
  }
}

export function* postGroup({ payload }) {
  try {
    const res = yield call(adminApi.postGroup, payload);

    if (res.error_code) {
      yield put({ type: adminActions.POST_GROUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    } else {
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({ type: adminActions.POST_GROUP_SUC });
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    yield put({ type: adminActions.POST_GROUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* getTasksAdmin() {
  try {
    const getAdmin = (state) => state.admin;
    const { dateConditions, focusGroup, focusMembers, pageCurrent } =
      yield select(getAdmin);

    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);

    if (!user || !user.group_id) {
      return null;
    }

    const data = {
      groupID: user.group_id,
      focusMembers,
      focusGroup,
      pageCurrent,
      dateStart: dateConditions?.startDate,
      dateEnd: dateConditions?.endDate,
    };

    const res = yield call(adminApi.getTasksAdmin, data);

    if (res.error_code) {
      yield put({ type: adminActions.GET_TASKS_ADMIN_FAL });
    } else {
      yield put({
        type: adminActions.GET_TASKS_ADMIN_SUC,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export function* getGroupMember() {
  try {
    const getUser = (state) => state.auth.user;
    const { group_id } = yield select(getUser);
    const resp = yield call(adminApi.getMemberRole, { group_id });

    if (resp.error_code) {
      yield put({ type: adminActions.GET_GROUP_MEMBER_FAL });
      return null;
    }

    let payload = [];
    Object.keys(resp.data).forEach((key) =>
      payload.push({
        ...resp.data[key],
        email: key,
      }),
    );
    yield put({
      type: adminActions.GET_GROUP_MEMBER_SUC,
      payload,
    });
  } catch (err) {
    yield put({ type: adminActions.GET_GROUP_MEMBER_FAL });
  }
}

export function* setMemberRole({ data }) {
  try {
    const getUser = (state) => state.auth.user;
    const { group_id, email } = yield select(getUser);
    const params = { group_id, ...data };

    const resp = yield call(adminApi.setMemberRole, params);

    if (resp.error_code) {
      yield put({
        type: commonActions.OPEN_TOAST,
        data: {
          text: resp.error_key,
          isWarning: true,
        },
      });
      yield put({ type: adminActions.SET_MEMBER_ROLE_FAL });
      return null;
    }

    yield put({ type: adminActions.SET_MEMBER_ROLE_SUC });

    if (data.email === email) {
      window.location.reload();
    } else {
      yield put({ type: adminActions.GET_ORGANIZATION });
    }
  } catch (err) {
    yield put({ type: adminActions.SET_MEMBER_ROLE_FAL });
  }
}

export function* postGroupMember({ data }) {
  try {
    const getUser = (state) => state.auth.user;
    const { group_id } = yield select(getUser);

    const { email } = data;
    const params = { group_id, email };

    const resp = yield call(adminApi.postGroupMember, params);

    if (resp.error_code) {
      throw resp.error_code;
    }

    // NOTE: succ
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: adminActions.POST_GROUP_MEMBER_SUC });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.inviteeSuc,
    });
    yield put({ type: adminActions.GET_ORGANIZATION });
  } catch (err) {
    const toasts = {
      4001308: toastStatus.inviterGroupOverLimit,
      4001302: toastStatus.inviteeAlreadyInGroup,
    };
    yield put({ type: adminActions.POST_GROUP_MEMBER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toasts[err] || toastStatus.inviteeFal,
    });
  }
}

export function* delGroupMember({ data }) {
  try {
    const getUser = (state) => state.auth.user;
    const { group_id } = yield select(getUser);

    const { email } = data;
    const params = { group_id, email };

    const resp = yield call(adminApi.delGroupMember, params);

    if (resp.error_code) {
      yield put({ type: adminActions.DEL_GROUP_MEMBER_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return null;
    }

    // NOTE: succ
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: adminActions.DEL_GROUP_MEMBER_SUC });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.delGroupSuc,
    });
    yield put({ type: adminActions.GET_ORGANIZATION });
  } catch (err) {
    yield put({ type: adminActions.DEL_GROUP_MEMBER_FAL });
  }
}

export function* getPermissions() {
  try {
    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);
    const resp = yield call(adminApi.getPermissions, {
      pack: "DS",
      group_id: user.group_id,
    });

    if (resp.error_code) {
      yield put({ type: adminActions.GET_PERMISSIONS_FAL });
    } else {
      yield put({ type: adminActions.GET_PERMISSIONS_SUC, payload: resp.data });
    }
  } catch (err) {
    console.log(err);
    yield put({ type: adminActions.GET_PERMISSIONS_FAL });
  }
}

function* putPermissions({ payload }) {
  try {
    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);
    const toSend = {
      pack: "DS",
      group_id: user.group_id,
      permissions: payload,
    };

    const resp = yield call(adminApi.putPermissions, toSend);

    if (resp.error_code) {
      yield put({ type: adminActions.PUT_PERMISSIONS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putPermissionsFal,
      });
    } else {
      yield put({ type: adminActions.PUT_PERMISSIONS_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putPermissionsSuc,
      });
      yield delay(4000);
      yield call(getPermissions);
    }
  } catch (err) {
    console.log(err);
    yield put({ type: adminActions.PUT_PERMISSIONS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putPermissionsFal,
    });
  }
}

export function* getReporting({ payload }) {
  try {
    const { group_id, users, dateObj } = payload;

    const params = {
      group_id,
      emails: users,
      start_from: dateObj.start_from,
      end_at: dateObj.end_at,
      zone: dateObj.zone,
    };

    const resp = yield call(adminApi.getReporting, params);

    if (resp.error_code) {
      yield put({ type: adminActions.GET_REPORTING_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    yield put({ type: adminActions.GET_REPORTING_SUC, payload: resp.data });
  } catch (err) {
    console.log(err);
    yield put({ type: adminActions.GET_REPORTING_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export function* getReportingMember({ payload }) {
  try {
    const { group_id, users, dateObj } = payload;

    const params = {
      group_id,
      emails: users,
      start_from: dateObj.start_from,
      end_at: dateObj.end_at,
      zone: dateObj.zone,
    };

    const resp = yield call(adminApi.getReportingMember, params);
    if (resp.error_code) {
      yield put({ type: adminActions.GET_REPORTING_MEMBER_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    yield put({
      type: adminActions.GET_REPORTING_MEMBER_SUC,
      payload: resp.data,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: adminActions.GET_REPORTING_MEMBER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export function* getGroupPermission() {
  try {
    const getUser = (state) => state.auth.user;
    const { group_id } = yield select(getUser);
    const data = { group_id };

    const resp = yield call(adminApi.getGroupPermission, data);

    if (resp.error_code) {
      yield put({ type: adminActions.GET_GROUP_PERMISSION_FAL });
      return null;
    }
    yield put({
      type: adminActions.GET_GROUP_PERMISSION_SUC,
      payload: resp.data,
    });
  } catch (err) {
    yield put({ type: adminActions.GET_GROUP_PERMISSION_FAL });
  }
}

function* getDeclineReasons({ payload }) {
  try {
    const { currentPath } = payload;
    const { features } = yield select((state) => state.auth);
    const isSuperAdmin = features && features.developer_console;

    const getUser = (state) => state.auth.user;
    const user = yield select(getUser);
    const { group_id } = user;

    const response = currentPath.includes("/developer/")
      ? yield call(adminApi.getDeclineReasons)
      : yield call(groupsApi.getGroupDeclineReasons, { group_id });

    const { error_code: errorCode, error_message: errorMessage } = response;
    if (response.error_code) {
      throw new Error(`${errorCode} ${errorMessage}`);
    }
    yield put({
      type: adminActions.GET_DECLINE_REASONS_SUC,
      payload: response?.data?.map(
        ({ id, content, created_at, system_reserved }) => ({
          id: id,
          content: content,
          createdAt: new Date(created_at).toLocaleString(),
          readOnly: !isSuperAdmin && system_reserved,
        }),
      ),
    });
  } catch (error) {
    yield put({ type: adminActions.GET_DECLINE_REASONS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.dynamicError,
      data: {
        text: error.toString(),
      },
    });
    console.error(error);
  }
}

function* setDeclineReason({ payload }) {
  try {
    const isCreate = !payload?.id;
    const {
      groupId: group_id,
      id: decline_reason_id,
      content,
      currentPath,
    } = payload;
    const response = currentPath.includes("/developer/")
      ? isCreate
        ? yield call(adminApi.postDeclineReasons, { content })
        : yield call(adminApi.putDeclineReasons, {
            decline_reason_id,
            content,
          })
      : isCreate
      ? yield call(groupsApi.postGroupDeclineReasons, { group_id, content })
      : yield call(groupsApi.putGroupDeclineReasons, {
          group_id,
          decline_reason_id,
          content,
        });

    const { error_code: errorCode, error_message: errorMessage } = response;
    if (response.error_code) {
      throw new Error(`${errorCode} ${errorMessage}`);
    }
    yield put({ type: commonActions.CLOSE_MODAL });
    yield call(getDeclineReasons, { payload: { currentPath } });
    yield put({ type: adminActions.SET_DECLINE_REASONS_SUC });
  } catch (error) {
    yield put({ type: adminActions.SET_DECLINE_REASONS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.dynamicError,
      data: {
        text: error.toString(),
      },
    });
    console.error(error);
  }
}

function* deleteDeclineReason({ payload }) {
  try {
    const { groupId: group_id, id: decline_reason_id, currentPath } = payload;
    const response = currentPath.includes("/developer/")
      ? yield call(adminApi.deleteDeclineReasons, { decline_reason_id })
      : yield call(groupsApi.deleteGroupDeclineReasons, {
          group_id,
          decline_reason_id,
        });

    const { error_code: errorCode, error_message: errorMessage } = response;
    if (response.error_code) {
      throw new Error(`${errorCode} ${errorMessage}`);
    }
    yield put({ type: commonActions.CLOSE_MODAL });
    yield call(getDeclineReasons, { payload: { currentPath } });
    yield put({ type: adminActions.DEL_DECLINE_REASONS_SUC });
  } catch (error) {
    yield put({ type: adminActions.DEL_DECLINE_REASONS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.dynamicError,
      data: {
        text: error.toString(),
      },
    });
    console.error(error);
  }
}

export function* getSystemCAList({ payload }) {
  try {
    const resp = yield call(adminApi.getSystemCAList);
    const { data, error_code: errorCode, error_message: errorMessage } = resp;

    if (data) {
      yield put({ type: adminActions.GET_SYSTEM_CA_LIST_SUC, payload: data });
      // NOTE: close modal for caEdit、caCreate、caDelete
      if (payload?.isCloseModal) {
        yield put({ type: commonActions.CLOSE_MODAL });
      }
    }

    if (errorCode) {
      yield put({ type: adminActions.GET_SYSTEM_CA_LIST_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        toastId: errorCode,
        payload: toastStatus.commonError,
        data: {
          text: `${errorCode} ${errorMessage}`,
        },
      });
    }
  } catch (err) {
    yield put({ type: adminActions.GET_SYSTEM_CA_LIST_FAL });
    console.error(err);
  }
}

function* handleSystemCAError(errorCode) {
  const errorToast = {
    400087: toastStatus.systemUpdateFal,
  };

  yield put({
    type: commonActions.OPEN_TOAST,
    payload: errorToast[errorCode] || toastStatus.commonError,
  });
}

export function* createSystemCA({ payload }) {
  try {
    const { name, cluster_id, email, token, pem } = payload;

    const resp = yield call(adminApi.createSystemCA, {
      name,
      cluster_id,
      email,
      token,
      pem,
    });

    const { data, error_code: errorCode } = resp;

    if (data) {
      yield put({ type: adminActions.CREATE_SYSTEM_CA_SUC });
      yield put({
        type: adminActions.GET_SYSTEM_CA_LIST,
        payload: { isCloseModal: true },
      });
    }

    if (errorCode) {
      yield put({ type: adminActions.CREATE_SYSTEM_CA_FAL });
      yield call(handleSystemCAError, errorCode);
    }
  } catch (err) {
    yield put({ type: adminActions.CREATE_SYSTEM_CA_FAL });
    console.error(err);
  }
}

export function* getSystemCADetail({ payload }) {
  try {
    const resp = yield call(adminApi.getSystemCADetail, {
      id: payload.id,
    });

    const { data, error_code: errorCode, error_message: errorMessage } = resp;

    if (data) {
      yield put({
        type: adminActions.GET_SYSTEM_CA_DETAIL_SUC,
        payload: data,
      });
    }

    if (errorCode) {
      yield put({ type: adminActions.GET_SYSTEM_CA_DETAIL_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        toastId: errorCode,
        payload: toastStatus.commonError,
        data: {
          text: `${errorCode} ${errorMessage}`,
        },
      });
    }
  } catch (err) {
    yield put({ type: adminActions.GET_SYSTEM_CA_DETAIL_FAL });
    console.error(err);
  }
}

export function* updateSystemCA({ payload }) {
  try {
    const { id, name, cluster_id, token, email, pem } = payload;

    let toPass = { id, name, cluster_id, token, email };
    if (pem) {
      toPass.pem = pem;
    }

    const resp = yield call(adminApi.updateSystemCA, toPass);
    const { data, error_code: errorCode } = resp;

    if (data) {
      yield put({
        type: adminActions.UPDATE_SYSTEM_CA_SUC,
      });
      yield put({
        type: adminActions.GET_SYSTEM_CA_LIST,
        payload: { isCloseModal: true },
      });
      yield put({
        type: adminActions.GET_SYSTEM_CA_DETAIL,
        payload: { id },
      });
    }

    if (errorCode) {
      yield put({ type: adminActions.UPDATE_SYSTEM_CA_FAL });
      yield call(handleSystemCAError, errorCode);
    }
  } catch (err) {
    yield put({ type: adminActions.UPDATE_SYSTEM_CA_FAL });
    console.error(err);
  }
}

export function* deleteSystemCA({ payload }) {
  try {
    const resp = yield call(adminApi.deleteSystemCA, {
      id: payload.id,
    });
    const { data, error_code: errorCode, error_message: errorMessage } = resp;

    if (data) {
      yield put({
        type: adminActions.DELETE_SYSTEM_CA_SUC,
      });
      yield put({
        type: adminActions.GET_SYSTEM_CA_LIST,
        payload: { isCloseModal: true },
      });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.systemCaDelSuc,
      });
    }

    if (errorCode) {
      yield put({ type: adminActions.DELETE_SYSTEM_CA_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        toastId: errorCode,
        payload: toastStatus.commonError,
        data: {
          text: `${errorCode} ${errorMessage}`,
        },
      });
    }
  } catch (err) {
    yield put({ type: adminActions.DELETE_SYSTEM_CA_FAL });
    console.error(err);
  }
}

export function* updateSystemCAMembers({ payload }) {
  try {
    const { id, members } = payload;

    const resp = yield call(adminApi.updateSystemCAMembers, {
      id,
      members,
    });
    const { data, error_code: errorCode, error_message: errorMessage } = resp;

    if (data) {
      const getUser = (state) => state.auth.user;
      const user = yield select(getUser);

      yield put({
        type: adminActions.UPDATE_SYSTEM_CA_MEMBERS_SUC,
      });
      yield put({
        type: adminActions.GET_SYSTEM_CA_LIST,
      });
      yield put({
        type: adminActions.GET_SYSTEM_CA_DETAIL,
        payload: { id },
      });
      // NOTE: open previous modal
      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.caEdit,
          modalData: {
            id,
            user,
          },
        },
      });
    }

    if (errorCode) {
      yield put({ type: adminActions.UPDATE_SYSTEM_CA_MEMBERS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        toastId: errorCode,
        payload: toastStatus.commonError,
        data: {
          text: `${errorCode} ${errorMessage}`,
        },
      });
    }
  } catch (err) {
    yield put({ type: adminActions.UPDATE_SYSTEM_CA_MEMBERS_FAL });
    console.error(err);
  }
}

export function* getRolesList({ payload }) {
  try {
    const resp = yield call(adminApi.getRolesList, payload);
    if (resp.error_code) {
      yield put({ type: adminActions.GET_ROLES_LIST_FAL });
      return null;
    }
    yield put({
      type: adminActions.GET_ROLES_LIST_SUC,
      payload: resp.data,
    });
  } catch (err) {
    yield put({ type: adminActions.GET_ROLES_LIST_FAL });
  }
}

export function* changeRolePriority({ payload }) {
  try {
    const resp = yield call(adminApi.changeRolePriority, payload);
    if (resp.error_code) {
      yield put({ type: adminActions.CHANGE_ROLE_PRIORITY_FAL });
      return null;
    }
    const { group_id } = payload;
    yield put({ type: adminActions.GET_ROLES_LIST, payload: { group_id } });
  } catch (err) {
    yield put({ type: adminActions.CHANGE_ROLE_PRIORITY_FAL });
  }
}

export function* createRole({ payload }) {
  try {
    const resp = yield call(adminApi.createRole, payload);
    if (resp.error_code) {
      if (resp.error_code === 400081) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.duplicatedRoleName,
        });
      }
      yield put({ type: adminActions.CREATE_ROLE_FAL });
      return null;
    }
    const { group_id } = payload;
    yield put({ type: adminActions.GET_ROLES_LIST, payload: { group_id } });
  } catch (err) {
    yield put({ type: adminActions.CREATE_ROLE_FAL });
  }
}

export function* deleteRole({ payload }) {
  try {
    const resp = yield call(adminApi.deleteRole, payload);
    if (resp.error_code) {
      if (resp.error_code === 403061) {
        yield put({
          type: commonActions.OPEN_TOAST,
          data: { isWarning: true, text: "role_is_assigned" },
        });
      }

      yield put({ type: adminActions.DELETE_ROLE_FAL });
      return null;
    }
    const { group_id } = payload;
    yield put({ type: adminActions.GET_ROLES_LIST, payload: { group_id } });
  } catch (err) {
    yield put({ type: adminActions.DELETE_ROLE_FAL });
  }
}

function* postAdminReissueTask({ payload }) {
  try {
    const resp = yield call(adminApi.postAdminReissueTask, payload);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: resp.error_code
        ? toastStatus.postReissueTaskFal
        : toastStatus.postReissueTaskSuc,
    });
    yield delay(5000);
    yield call(Router.push, "/admin/tasks");
  } catch (err) {
    console.log(err);
    yield put({ type: adminActions.POST_ADMIN_REISSUE_TASK_FAL });
  }
}

const eventListeners = [
  takeEvery(adminActions.GET_ORGANIZATION, getOrganization),
  takeEvery(adminActions.GET_ORGANIZATION_LIST, getOrganizationList),
  takeEvery(adminActions.PUT_ORGANIZATION, putOrganization),
  takeEvery(adminActions.POST_GROUP, postGroup),
  takeEvery(adminActions.GET_TASKS_ADMIN, getTasksAdmin),
  takeEvery(adminActions.SET_FOCUS_GROUP, getTasksAdmin),
  takeEvery(adminActions.SET_FOCUS_MEMBERS, getTasksAdmin),
  takeEvery(adminActions.SET_DATE_CONDITIONS, getTasksAdmin),
  takeEvery(adminActions.SET_PAGE_CURRENT, getTasksAdmin),
  takeEvery(adminActions.GET_GROUP_MEMBER, getGroupMember),
  takeEvery(adminActions.SET_MEMBER_ROLE, setMemberRole),
  takeEvery(adminActions.POST_GROUP_MEMBER, postGroupMember),
  takeEvery(adminActions.DEL_GROUP_MEMBER, delGroupMember),
  takeEvery(adminActions.GET_PERMISSIONS, getPermissions),
  takeEvery(adminActions.PUT_PERMISSIONS, putPermissions),
  takeEvery(adminActions.GET_REPORTING, getReporting),
  takeEvery(adminActions.GET_REPORTING_MEMBER, getReportingMember),
  takeEvery(adminActions.GET_GROUP_PERMISSION, getGroupPermission),
  takeEvery(adminActions.GET_DECLINE_REASONS, getDeclineReasons),
  takeEvery(adminActions.SET_DECLINE_REASONS, setDeclineReason),
  takeEvery(adminActions.DEL_DECLINE_REASONS, deleteDeclineReason),
  takeEvery(adminActions.GET_SYSTEM_CA_LIST, getSystemCAList),
  takeEvery(adminActions.CREATE_SYSTEM_CA, createSystemCA),
  takeEvery(adminActions.GET_SYSTEM_CA_DETAIL, getSystemCADetail),
  takeEvery(adminActions.UPDATE_SYSTEM_CA, updateSystemCA),
  takeEvery(adminActions.DELETE_SYSTEM_CA, deleteSystemCA),
  takeEvery(adminActions.UPDATE_SYSTEM_CA_MEMBERS, updateSystemCAMembers),
  takeEvery(adminActions.GET_ROLES_LIST, getRolesList),
  takeEvery(adminActions.CHANGE_ROLE_PRIORITY, changeRolePriority),
  takeEvery(adminActions.CREATE_ROLE, createRole),
  takeEvery(adminActions.DELETE_ROLE, deleteRole),
  takeEvery(adminActions.POST_ADMIN_REISSUE_TASK, postAdminReissueTask),
];

export default eventListeners;
