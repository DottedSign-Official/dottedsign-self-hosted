import { call, put, takeEvery, select } from "redux-saga/effects";
import * as templateApi from "../../apis/template";
import * as createApi from "../../apis/create";
import * as commonActions from "../../constants/commonTypes";
import * as templateActions from "../../constants/templateTypes";
import toastStatus from "../../constants/toast";

import { TEMPLATE_SEARCH_TYPE, MODAL_TYPE } from "../../constants/constants";

function* getCurrentRequestParams() {
  const getLabelFocus = (state) => state.template.labelFocus;
  const labelFocus = yield select(getLabelFocus);

  const getPageFocusFocus = (state) => state.template.pageFocus;
  const pageFocus = yield select(getPageFocusFocus);

  const getSearchContent = (state) => state.template.searchContent;
  const searchContent = yield select(getSearchContent);

  const getSearchType = (state) => state.template.searchType;
  const searchType = yield select(getSearchType);

  const getIsFrontDesk = (state) => state.auth.isFrontDesk;
  const isFrontDesk = yield select(getIsFrontDesk);

  const getIsPublicForm = (state) => state.create?.isPublicForm;
  const isPublicForm = yield select(getIsPublicForm);

  const searchTypeToParamKeys = {
    [TEMPLATE_SEARCH_TYPE.name]: "terms",
    [TEMPLATE_SEARCH_TYPE.code]: "code",
  };
  const searchParamKey = searchTypeToParamKeys[searchType];

  const data = {
    search_tags: labelFocus,
    page: pageFocus,
    [searchParamKey]: searchContent,
    exclude_actions: isFrontDesk || isPublicForm ? ["review"] : [],
  };

  return data;
}

function* updateTemplates({ payload }) {
  try {
    const currentParams = yield call(getCurrentRequestParams);

    let data = { ...currentParams };

    if (payload && payload.page) {
      data.page = payload.page;
    }

    if (payload && payload.search_tags) {
      data.search_tags = payload.search_tags;
    }

    if (payload && payload.terms) {
      data.terms = payload.terms;
    }
    if (payload && payload.code) {
      data.code = payload.code;
    }

    if (payload && payload.exclude_actions) {
      data.exclude_actions = payload.exclude_actions;
    }

    const resp = yield call(templateApi.getTemplates, data);

    if (resp.error_code) {
      yield put({ type: templateActions.GET_TEMPLATES_FAL });
    } else {
      yield put({
        type: templateActions.GET_TEMPLATES_SUC,
        payload: {
          templates: resp.data.templates,
          pages: resp.data.total_pages,
        },
      });
    }
  } catch (err) {
    yield put({ type: templateActions.GET_TEMPLATES_FAL });
  }
}

function* getTemplatesAll(payload) {
  yield call(updateTemplates, payload);
}

function* delTemplate({ payload }) {
  try {
    const resp = yield call(templateApi.delTemplate, payload);

    if (resp.error_code) {
      yield put({ type: templateActions.DEL_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.delTemplateFal,
      });
    } else {
      yield put({ type: templateActions.DEL_TEMPLATE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.delTemplateSuc,
      });
      yield call(updateTemplates, {});
    }
  } catch (err) {
    yield put({ type: templateActions.DEL_TEMPLATE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.delTemplateFal,
    });
  }
}

function* putTemplate({ payload }) {
  try {
    const resp = yield call(createApi.putTemplate, payload);
    if (resp.error_code && resp.error_code === 400080) {
      yield put({ type: templateActions.PUT_TEMPLATE_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.duplicateTemplateCode,
      });
    } else if (resp.error_code) {
      yield put({ type: templateActions.PUT_TEMPLATE_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putTemplateFal,
      });
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putTemplateSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield call(updateTemplates, {});
      yield put({ type: templateActions.PUT_TEMPLATE_SETTINGS_SUC });
    }
  } catch (err) {
    yield put({ type: templateActions.PUT_TEMPLATE_SETTINGS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putTemplateFal,
    });
  }
}

function* getTemplateShareInfo({ payload }) {
  try {
    const { templateId } = payload;
    const resp = yield call(templateApi.getTemplateShareInfo, { templateId });

    if (resp.data && resp.data.group_share) {
      yield put({ type: templateActions.GET_TEMPLATE_SHARE_INFO_FAL });
      yield put({
        type: templateActions.GET_TEMPLATE_SHARE_INFO_SUC,
        payload: resp.data.group_share,
      });
      return;
    }

    if (resp.error_code) {
      yield put({ type: templateActions.GET_TEMPLATE_SHARE_INFO_FAL });

      const errorMsg = yield call(getErrorMsg, resp.error_code);

      return yield put({
        type: commonActions.OPEN_TOAST,
        payload: errorMsg,
      });
    }

    yield put({ type: templateActions.GET_TEMPLATE_SHARE_INFO_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: templateActions.GET_TEMPLATE_SHARE_INFO_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putTemplateShare({ payload }) {
  try {
    const resp = yield call(templateApi.putTemplateShare, payload);

    if (resp.error_code) {
      yield put({ type: templateActions.PUT_TEMPLATE_SHARE_FAL });

      const errorMsg = yield call(getErrorMsg, resp.error_code);

      return yield put({
        type: commonActions.OPEN_TOAST,
        payload: errorMsg,
      });
    } else {
      yield put({ type: templateActions.PUT_TEMPLATE_SHARE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putTemplateShareSuc,
      });

      yield call(getTemplatesAll);
    }
  } catch (err) {
    console.log(err);
  }
}

function* getTemplateShareList({ payload }) {
  try {
    const payloadMinified = {
      filter_type: payload?.filterType, // NOTE: self or other
      page: payload?.page || 1,
      per_page: 10,
    };

    const resp = yield call(templateApi.getTemplateShareList, payloadMinified);

    if (resp.error_code) {
      yield put({ type: templateActions.GET_TEMPLATE_SHARE_LIST_FAL });
    } else {
      yield put({
        type: templateActions.GET_TEMPLATE_SHARE_LIST_SUC,
        payload: {
          currentPage: resp.data.current_page,
          totalPages: resp.data.total_pages,
          totalTemplates: resp.data.total_count,
          templateShareList: resp.data.shares,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* putTemplateAdminShare({ payload }) {
  try {
    const { templateId, filterType, groupIds } = payload;

    const getCurrentPage = (state) => state.template.currentPage;
    const currentPage = yield select(getCurrentPage);

    const payloadMinified = {
      template_id: templateId,
      group_ids: groupIds,
    };

    yield put({ type: templateActions.FETCHING_TEMPLATE });

    const resp = yield call(templateApi.putTemplateAdminShare, payloadMinified);

    if (resp.error_code) {
      yield put({ type: templateActions.PUT_TEMPLATE_ADMIN_SHARE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    } else {
      yield put({ type: templateActions.PUT_TEMPLATE_ADMIN_SHARE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putTemplateShareSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield call(getTemplateShareList, {
        payload: {
          page: currentPage,
          filterType,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* deleteTemplateAdminShare({ payload }) {
  try {
    const getCurrentPage = (state) => state.template.currentPage;
    const currentPage = yield select(getCurrentPage);

    const payloadMinified = {
      template_id: payload.templateId,
      group_id: payload.groupId,
    };

    const resp = yield call(
      templateApi.deleteTemplateAdminShare,
      payloadMinified,
    );

    if (resp.error_code) {
      yield put({ type: templateActions.DELETE_TEMPLATE_ADMIN_SHARE_FAL });

      switch (resp.error_code) {
        case 4001314:
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.sharedTemplateHasOtherGroups,
          });
          break;

        default:
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.deleteTemplateShareFal,
          });
          break;
      }

      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.deleteTemplateAdminShare,
          modalData: {
            templateId: payload.templateId,
          },
        },
      });
    } else {
      yield put({ type: templateActions.DELETE_TEMPLATE_ADMIN_SHARE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.deleteTemplateShareSuc,
      });
      yield call(getTemplateShareList, {
        payload: {
          page: currentPage,
          filterType: payload.filterType,
        },
      });

      if (payload.isCloseModal) {
        yield put({ type: commonActions.CLOSE_MODAL });
        return;
      }

      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.deleteTemplateAdminShare,
          modalData: {
            templateId: payload.templateId,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function* duplicateTemplate({ payload }) {
  try {
    const resp = yield call(templateApi.duplicateTemplate, payload);

    const {
      data: { template },
    } = resp;

    yield put({
      type: templateActions.DUPLICATE_TEMPLATE_SUC,
      payload: template,
    });

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.duplicateTemplateSuc,
    });

    yield put({ type: commonActions.CLOSE_MODAL });
    yield call(updateTemplates, {});
  } catch (error) {
    yield put({
      type: templateActions.DUPLICATE_TEMPLATE_FAL,
    });

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.duplicateTemplateFal,
    });
  }
}

const getErrorMsg = (errorCode) => {
  switch (errorCode) {
    case 404035:
      // NOTE: not found
      return toastStatus.templateNotFound;

    case 400053:
      // NOTE: deleted
      return toastStatus.templateDeleted;

    case 403030:
      // NOTE: not owner
      return toastStatus.templateAccessDenied;

    case 403045:
      // NOTE: not sharable
      return toastStatus.templateNotSharable;

    default:
      return toastStatus.commonError;
  }
};

const eventListeners = [
  takeEvery(templateActions.GET_TEMPLATES_ALL, getTemplatesAll),
  takeEvery(templateActions.DEL_TEMPLATE, delTemplate),
  takeEvery(templateActions.PUT_TEMPLATE_SETTINGS, putTemplate),
  takeEvery(templateActions.MANAGE_TEMPLATE_LABEL, updateTemplates),
  takeEvery(templateActions.SET_LABEL, updateTemplates),
  takeEvery(templateActions.SET_PAGE, updateTemplates),
  takeEvery(templateActions.SET_SEARCH_CONTENT, updateTemplates),
  takeEvery(templateActions.GET_TEMPLATE_SHARE_INFO, getTemplateShareInfo),
  takeEvery(templateActions.PUT_TEMPLATE_SHARE, putTemplateShare),
  takeEvery(templateActions.GET_TEMPLATE_SHARE_LIST, getTemplateShareList),
  takeEvery(templateActions.PUT_TEMPLATE_ADMIN_SHARE, putTemplateAdminShare),
  takeEvery(
    templateActions.DELETE_TEMPLATE_ADMIN_SHARE,
    deleteTemplateAdminShare,
  ),
  takeEvery(templateActions.DUPLICATE_TEMPLATE, duplicateTemplate),
];

export default eventListeners;
