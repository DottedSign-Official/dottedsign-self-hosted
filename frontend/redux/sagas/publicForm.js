import { call, put, takeEvery, select, delay, race } from "redux-saga/effects";
import Router from "next/router";
import * as publicFormApi from "../../apis/publicForm";
import * as authActions from "../../constants/authTypes";
import * as commonActions from "../../constants/commonTypes";
import * as publicFormActions from "../../constants/publicFormTypes";
import * as signActions from "../../constants/signTypes";
import * as settingsActions from "../../constants/settingsTypes";
import { openModal as openModalAction } from "../actions/common";
import {
  PREVIEW_ERROR,
  MODAL_TYPE,
  EMBEDDED_STATUS,
  PUBLIC_FORM_PER_PAGE,
} from "../../constants/constants";
import toastStatus from "../../constants/toast";

function* getPublicFormAll({ data }) {
  try {
    const { isDelete, ...res } = data || {};
    const resp = yield call(publicFormApi.getPublicFormAll, res);

    if (resp.error_code) {
      yield put({ type: publicFormActions.GET_PUBLIC_FORM_ALL_FAL });
      return;
    }

    const dataTrans = { ...resp.data };

    if (isDelete && resp.data.forms.length === 0 && res.page > 1) {
      dataTrans.current_page -= 1;
    }

    yield put({
      type: publicFormActions.GET_PUBLIC_FORM_ALL_SUC,
      payload: dataTrans,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.GET_PUBLIC_FORM_ALL_FAL });
  }
}

function* getPublicFormPreview({ data }) {
  try {
    if (data.signer_email) {
      yield put({
        type: publicFormActions.SET_PREVIEW_EMAIL,
        payload: data.signer_email,
      });
    }

    const { isIni, ...res } = data;
    const resp = yield call(publicFormApi.getPublicFormPreview, res);

    if (resp.error_code === 400901 && isIni) {
      yield put({ type: authActions.SET_PUBLIC_FORM_INI });
      yield put({
        type: signActions.SET_IS_PUBLIC_FORM_SIGNING,
        payload: { form_uuid: data.form_uuid },
      });

      yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });

      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.consent,
          modalData: {
            confirmData: openModalAction({
              modalType: MODAL_TYPE.publicFormSignerInfo,
              modalData: {
                form_uuid: data.form_uuid,
                requisite: resp.signer_requisite,
                role: resp.signer_role,
                title: resp.form_name,
                desc: resp.form_description,
              },
            }),
          },
        },
      });
      return;
    }

    if (resp.error_code) {
      if (resp.error_code === 400220) {
        yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.emailFormatError,
        });
        return;
      }

      if (resp.error_code === 400901) {
        yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.signerInfoError,
        });
        return;
      }

      if (resp.error_code === 400916 || resp.error_code === 400915) {
        yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: PREVIEW_ERROR.publicFormUnavailable },
        });
        return;
      }

      yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: PREVIEW_ERROR.publicForm },
      });
      return;
    }

    const fakeUser = {
      isVerified: true,
      security_checked_at: true,
      name: data.signer_name,
      email: data.signer_email || "",
    };
    yield put({
      type: authActions.SET_USER,
      payload: {
        isFake: true,
        user: fakeUser,
      },
    });

    const respStart = yield call(publicFormApi.startPublicForm, res);
    if (respStart.error_code) {
      if (respStart.error_code === 403032) {
        yield put({
          type: commonActions.OPEN_MODAL,
          payload: {
            modalType: MODAL_TYPE.taskUsageLimitWarning,
            modalData: {
              isPublicForm: true,
            },
          },
        });
        yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
        return;
      }

      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.emailFormatError,
        });
      } else if (respStart.error_code === 403032) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.publicFormOwnerReachLimit,
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.publicFormInvalid,
        });
      }

      yield delay(5000);
      yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield call(Router.push, "/tasks");
      return;
    }

    yield put({
      type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_SUC,
      payload: {
        file_name: resp.data?.form_name,
        description: resp.data?.description,

        preview_url: resp.data?.form_info?.download_link,

        download_url: resp.data?.form_info?.download_link,
        signer_name: data.signer_name,
        signer_email: data.signer_email,
        signer_infos: resp.data.signer_infos,
        form_token: respStart.data.form_token,
      },
    });

    yield put({ type: commonActions.CLOSE_MODAL });

    const { payload } = yield race({
      payload: call(waitPdfDone),
      timeout: delay(20000),
    });
    if (!payload) {
      yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: EMBEDDED_STATUS.unableFetchTemplate },
      });
      return;
    }

    yield put({
      type: signActions.READ_PUBLIC_FORM,
      data: {
        ...res,
        form_token: respStart.data.form_token,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.GET_PUBLIC_FORM_PREVIEW_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
    yield delay(5000);
    yield call(Router.push, "/tasks");
  }
}

function* deletePublicForm({ data }) {
  try {
    const getPublicFormState = (state) => state.publicForm;
    const { publicFormCurrentPage } = yield select(getPublicFormState);
    const { form_id } = data;
    if (!form_id) {
      yield put({ type: publicFormActions.DELETE_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.deletePublicFormFal,
      });
      return;
    }

    const resp = yield call(publicFormApi.deletePublicForm, form_id);

    if (resp.error_code) {
      yield put({ type: publicFormActions.DELETE_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.deletePublicFormFal,
      });
      return;
    }

    yield put({ type: publicFormActions.DELETE_PUBLIC_FORM_SUC });
    yield put({
      type: publicFormActions.GET_PUBLIC_FORM_ALL,
      data: {
        page: publicFormCurrentPage,
        per_page: PUBLIC_FORM_PER_PAGE,
        isDelete: true,
      },
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.deletePublicFormSuc,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.DELETE_PUBLIC_FORM_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* getPublicFormCsv({ data }) {
  try {
    if (!data) {
      yield put({ type: publicFormActions.GET_PUBLIC_FORM_CSV_FAL });
      return;
    }

    const resp = yield call(publicFormApi.getPublicFormCsv, data);

    if (resp.error) {
      yield put({ type: publicFormActions.GET_PUBLIC_FORM_CSV_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.csvFetchFailed,
      });
    }

    yield put({ type: publicFormActions.GET_PUBLIC_FORM_CSV_SUC });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.GET_PUBLIC_FORM_CSV_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putPublicFormStatus({ data }) {
  try {
    if (!data) {
      yield put({ type: publicFormActions.PUT_PUBLIC_FORM_STATUS_FAL });
      return;
    }

    const resp = yield call(publicFormApi.putPublicFormStatus, data);
    const getPublicFormState = (state) => state.publicForm;
    const { publicFormCurrentPage } = yield select(getPublicFormState);

    if (resp.error_code) {
      yield put({ type: publicFormActions.PUT_PUBLIC_FORM_STATUS_FAL });

      let toastType;
      switch (resp.error_code) {
        case 400915:
          toastType = toastStatus.publicFormDeleted;
          break;
        case 400919:
          toastType = toastStatus.publicFormTemplateModified;
          break;
        case 400921:
          toastType = toastStatus.publicFormReachTarget;
          break;
        case 403058:
          toastType = toastStatus.publicFormReachLimit;
          break;
        default:
          toastType = toastStatus.commonError;
          break;
      }
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastType,
      });
      return;
    }

    yield put({ type: publicFormActions.PUT_PUBLIC_FORM_STATUS_SUC });
    yield put({
      type: publicFormActions.GET_PUBLIC_FORM_ALL,
      data: { page: publicFormCurrentPage, per_page: PUBLIC_FORM_PER_PAGE },
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload:
        data.status === "publish"
          ? toastStatus.publishSuc
          : toastStatus.unpublishSuc,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.PUT_PUBLIC_FORM_STATUS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* waitPdfDone() {
  const getPdfDone = (state) => state.pdf.isRenderDone;
  let isRenderDone = yield select(getPdfDone);

  while (!isRenderDone) {
    yield delay(500);
    isRenderDone = yield select(getPdfDone);
  }

  return true;
}

function* putPublicFormCompress({ data }) {
  try {
    const getUser = (state) => state.auth;
    const { user } = yield select(getUser);

    if (!user) {
      yield put({ type: publicFormActions.PUT_PUBLIC_FORM_COMPRESS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    const resp = yield call(publicFormApi.putPublicFormCompress, data);

    if (resp.error_code) {
      yield put({ type: publicFormActions.PUT_PUBLIC_FORM_COMPRESS_FAL });

      if (resp.error_code === 400935) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putPublicFormCompressFalProcessing,
        });
        return;
      }

      if (resp.error_code === 400918) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putPublicFormCompressFalInvalid,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    yield put({
      type: publicFormActions.PUT_PUBLIC_FORM_COMPRESS_SUC,
      payload: resp.data,
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putPublicFormCompressSuc,
      data: user.email,
    });
    yield put({
      type: settingsActions.GET_SIGNING_GROUP,
      data: { page: 1 },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: publicFormActions.PUT_PUBLIC_FORM_COMPRESS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

export default [
  takeEvery(publicFormActions.GET_PUBLIC_FORM_ALL, getPublicFormAll),
  takeEvery(publicFormActions.GET_PUBLIC_FORM_PREVIEW, getPublicFormPreview),
  takeEvery(publicFormActions.DELETE_PUBLIC_FORM, deletePublicForm),
  takeEvery(publicFormActions.GET_PUBLIC_FORM_CSV, getPublicFormCsv),
  takeEvery(publicFormActions.PUT_PUBLIC_FORM_STATUS, putPublicFormStatus),
  takeEvery(publicFormActions.PUT_PUBLIC_FORM_COMPRESS, putPublicFormCompress),
];
