import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  delay,
  race,
  take,
  all,
  actionChannel,
} from "redux-saga/effects";

import { fetchFileData } from "./create";

import Router from "next/router";

import { postFastSigningConsent as postFastSigningConsentAction } from "../actions/sign";
import { openModal as openModalAction } from "../actions/common";
import {
  postCheck as postCheckAction,
  postReviewDone as postReviewDoneAction,
} from "../actions/sign";
import * as signApi from "../../apis/sign";
import * as createApi from "../../apis/create";
import { convertImagesToVideo } from "../../apis/others";
import * as createActions from "../../constants/createTypes";
import * as signActions from "../../constants/signTypes";
import * as publicFormActions from "../../constants/publicFormTypes";
import { RESET_PREVIEW } from "../../constants/previewTypes";
import { RESET_PDF } from "../../constants/pdfTypes";
import * as authActions from "../../constants/authTypes";
import * as commonActions from "../../constants/commonTypes";
import * as socketActions from "../../constants/socketTypes";
import { typeToBase64Type } from "../../helpers/base64";
import socketEvents from "../../constants/socketEvents";
import { SOCKET_CHANNEL_TYPE_SIGN } from "../../constants/socketTypes";

import xfdf2Obj from "../../helpers/xfdf";
import { updatePhotoSignatures } from "../../helpers/sign";
import { getImageFormat } from "../../helpers/image";
import getAllViewport from "../../helpers/getViewport";
import { getMyCoord } from "../../helpers/coord2Styles";
import { getDoc, getPdfDocDataURL } from "../../helpers/others";
import { unixToString } from "../../helpers/time";
import { filterPageInvolversByFileId } from "../../helpers/task";
import { getFileExtension } from "../../helpers/parser";
import {
  transformFieldType,
  referencesTransformApi,
} from "../../helpers/transform.js";
import { getFieldObjectActions } from "../../helpers/conditional";
import { parseTaskToNavbar } from "../../apis/middleware/helpers/tasks";
import {
  COMMON_ERROR,
  PDF_TASK_STATUS,
  PDF_TASK_PERSONAL_STATUS,
  PDF_TASK_HINT,
  PDF_TASK_WARNING,
  PDF_RENDER_TYPE,
  PREVIEW_ERROR,
  AUTH_ERROR,
  MODAL_TYPE,
  TASKS_PER_PAGE,
  PUBLIC_FORM_PER_PAGE,
  SIGNATURE_CATEGORY,
  GROUP_HINT,
  EMBEDDED_STATUS,
  PREVIEW_SHARE_TASK_WARNING,
  fieldTypes,
  STAGE_ACTION,
} from "../../constants/constants";
import coverTypes from "../../components/Cover/data";
import toastStatus from "../../constants/toast";

const otpValidators = {
  onRead: function* validator(data) {
    if (data) {
      const response = yield call(signApi.getSignTask, data);
      if (response?.data) {
        return response;
      } else {
        yield put({ type: signActions.GET_SIGN_TASK_OTP_FAL });
      }
    }
  },
  onSend: function* validator(data) {
    if (data) {
      const response = yield call(signApi.putSigns, data);
      if (response?.data) {
        return response;
      } else {
        yield put({ type: signActions.PUT_SIGN_TASK_OTP_FAL });
      }
    }
  },
};

const otpPublicFormValidators = {
  onRead: function* validator(data) {
    if (data) {
      const response = yield call(signApi.readPublicForm, data);
      if (response?.data) {
        return response;
      } else {
        yield put({ type: signActions.READ_PUBLIC_FORM_FAL });
      }
    }
  },
  onSend: function* validator(data) {
    if (data) {
      const response = yield call(signApi.putPublicFormSign, data);
      if (response?.data) {
        return response;
      } else {
        yield put({ type: signActions.PUT_PUBLIC_FORM_SIGN_FAL });
      }
    }
  },
};

const toVerifyInfoQueryParams = (verify_info = {}) =>
  Object.keys(verify_info).reduce((obj, key) => {
    obj[`verify_info[${key}]`] = verify_info[key];
    return obj;
  }, {});

const getVerifyModalType = (verify_info) => {
  if (!verify_info || !verify_info[0]) {
    return null;
  }

  if (
    verify_info[0].verify_type === "cht_personal" ||
    verify_info[0].verify_type === "cht_company" ||
    verify_info[0].verify_type === "cht_system"
  ) {
    return MODAL_TYPE.chtVerify;
  }

  if (
    verify_info[0].verify_type === "email" ||
    verify_info[0].verify_type === "sms"
  ) {
    return MODAL_TYPE.otpVerify;
  }

  return null;
};

function* checkOtpOnRead({ response, toTransfer }) {
  const { verify_info, error_code } = response;
  if (error_code !== 403034) {
    return response;
  }

  const { taskId } = toTransfer;
  yield put({
    type: signActions.GET_SIGN_TASK_SUC,
    payload: { task_id: taskId },
  });

  const parser = (verify_info) => ({
    ...toTransfer,
    verify_info: toVerifyInfoQueryParams(verify_info),
  });

  return yield call(verifyIdentity, {
    verify_info,
    parser,
    validator: otpValidators.onRead,
  });
}

function* checkOtpOnSend({ response, toTransfer }) {
  const { verify_info, error_code } = response;
  if (error_code !== 403034) {
    return response;
  }

  yield put({ type: signActions.PUT_SIGN_TASK_FAL });

  const parser = (verify_info) => ({
    data: { ...toTransfer.data, verify_info },
  });

  return yield call(verifyIdentity, {
    verify_info,
    parser,
    validator: otpValidators.onSend,
  });
}

function* checkOtpOnReadPublicForm({ response, requestData }) {
  const { verify_info, error_code } = response;
  if (error_code !== 403034) {
    return response;
  }

  const parser = (verify_info) => ({
    ...requestData,
    ...toVerifyInfoQueryParams(verify_info),
  });

  return yield call(verifyIdentity, {
    verify_info,
    parser,
    validator: otpPublicFormValidators.onRead,
  });
}

function* checkOtpOnSendPublicForm({ response, requestData }) {
  const { verify_info, error_code } = response;
  if (error_code !== 403034) {
    return response;
  }

  yield put({ type: signActions.PUT_PUBLIC_FORM_SIGN_FAL });

  const parser = (verify_info) => ({
    ...requestData,
    verify_info,
  });

  return yield call(verifyIdentity, {
    verify_info,
    parser,
    validator: otpPublicFormValidators.onSend,
  });
}

function* verifyIdentity({ verify_info, parser, validator }) {
  // NOTE: need identity authentications
  // NOTE: verify_info:
  // NOTE:   req: {uuid*, verify_data*, identity_verify_token}
  // NOTE:   resp: Array<{uuid*, verify_type*, verify_source*, occassion*, state*}>
  const modalType = getVerifyModalType(verify_info);

  yield put({
    type: commonActions.OPEN_MODAL,
    payload: {
      modalType,
      modalData: {
        receiver: verify_info,
      },
    },
  });

  while (true) {
    const {
      payload: { verify_info },
    } = yield take(commonActions.SUBMIT_MODAL);
    const data = yield call(validator, parser(verify_info));
    if (data) {
      yield put({ type: commonActions.CLOSE_MODAL });
      return data;
    }
  }
}

function* getSignatures() {
  yield call(getSigns, { data: { category: "signature" } });
}

function* getSigns({ data }) {
  try {
    const resp = yield call(signApi.getSigns, data);
    yield put({ type: signActions.GET_SIGNS_SUC });
    yield put({
      type: signActions.SET_SIGNS,
      payload: { signs: resp.data, category: data.category },
    });
  } catch (err) {
    yield put({ type: signActions.GET_SIGNS_FAL });
  }
}

function* fetchDraft({ data }) {
  try {
    const { sign_task_id: taskId, envelope_id: envelopeId } = data;

    const getTaskUuid = (state) => state.sign.taskUuid;
    const taskUuid = yield select(getTaskUuid);
    let toTransfer = taskId ? { taskId } : { envelopeId };
    if (taskUuid) {
      toTransfer.work_id = taskUuid;
    }

    const res = yield call(signApi.getSignTask, toTransfer);

    if (res?.data?.status === PDF_TASK_STATUS.draft) {
      if (res?.data?.xfdf_ready) {
        // NOTE: revertDraft
        yield put({
          type: createActions.REVERT_DRAFT,
          data: res.data,
        });
        yield put({ type: signActions.GET_SIGN_TASK_STOP });
      } else {
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.fileNotReady,
          },
        });
      }
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.notDraft,
      });
      yield take(commonActions.CLOSE_TOAST);
      yield call(Router.push, "/tasks");
      return;
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.fetchDraftFal,
    });
  }
}

function* getPreviewShareLink({ data: { taskId, envelopeId, language } }) {
  try {
    const res = yield call(signApi.getPreviewShareLink, { taskId, envelopeId });
    if (res.data) {
      const {
        data: { share_link: link },
      } = res;

      const host = new URL(link).host;
      const share_link = link.replace(host, `${host}/${language}`);

      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.previewShareLink,
          modalData: {
            previewShareLink: share_link,
          },
        },
      });
    } else {
      throw res;
    }
  } catch (e) {
    console.error(e);
    yield put({
      type: commonActions.OPEN_TOAST,
      data: {
        text: "preview_share_link_fal",
        isWarning: true,
      },
    });
  }
}

function* getPreviewShareSignTask({
  data: { code, sign_task_id, envelope_id: envelopeId },
}) {
  try {
    const res = yield call(signApi.getPreviewShareSignTask, {
      code,
      sign_task_id,
      envelopeId,
    });

    // NOTE: errors
    if (res.error_code) {
      throw res.error_code;
    }

    const {
      envelope_id,
      task_owner_info,
      envelope_owner_info,
      stage_infos,
      current_member_turn,
      own_by_me,
      forget_remind,
      need_otp_verify,
      deadline,
      expire_remind,
      remind_days_before_expire,
      receiver_lang,
      message,
      download_link,
      complete_link,
      decline_reasons,
      file_name,
      task_infos: file_list,
      cc_info,
    } = res.data;
    const owner_info = task_owner_info || envelope_owner_info;
    const expires_in_days = null;
    const isInvolved = stage_infos.find((step) => step.name === "Me");
    const isEnvelope = !!envelope_id;

    const fileUrl = isEnvelope
      ? file_list[0].download_link
      : (yield select((state) => state.create.fileUrl)) || download_link;

    let pdfDataUrl;
    let vpData;
    let envelopeFiles;

    if (isEnvelope) {
      envelopeFiles = yield all(
        file_list.map((file) =>
          call(fetchFileData, { file, isGetSignTask: true }),
        ),
      );
      pdfDataUrl = envelopeFiles[0].fileUrl;
      vpData = envelopeFiles[0].vpData;
    } else {
      const doc = yield call(getDoc, fileUrl);
      pdfDataUrl = yield call(getPdfDocDataURL, doc);
      vpData = yield call(getAllViewport, doc);
    }

    if (!vpData) {
      throw COMMON_ERROR.error;
    }

    // NOTE: set fileUrl for PdfViewer
    yield put({
      type: signActions.SET_FILE_URL,
      payload: {
        url: pdfDataUrl,
      },
    });

    const { viewport, rotates } = vpData;

    let pageInvolvers = {};
    let allFilesInvolvers = {};
    let involved = []; // NOTE: for task info update (change signer)
    let taskBlocks = [];
    let attachments;
    let stagesUpdate = []; // NOTE: for update only
    let photoSignatures = [];

    if (envelope_id) {
      attachments = [];

      let vpDataMap = {};

      for (const envelopeFile of envelopeFiles) {
        if (!envelopeFile.vpData) {
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.revertDraftFal,
          });
          yield delay(5000);
          yield call(Router.push, "/tasks");
          throw new Error(
            `Viewport data not found for task_id: ${envelopeFile.fileId}`,
          );
        }

        vpDataMap[envelopeFile.fileId] = envelopeFile.vpData;
      }

      stage_infos.map((stage, idx) => {
        const isMyTurn = stage.name === "Me";

        // NOTE: involved
        if (
          stage.action_type &&
          stage.action_type !== PDF_TASK_PERSONAL_STATUS.send
        ) {
          involved.push({
            key: idx,
            name: stage.name,
            email: stage.email,
          });
        }

        // NOTE: stage setting
        let taskStageSetting;
        const myStageSetting = {
          forward_enable: true,
          decline_enable: false,
          viewable_in_processing: true,
          viewable_in_completed: true,
        };
        if (stage.stage_setting) {
          taskStageSetting = stage.stage_setting;
        }
        if (isMyTurn && own_by_me) {
          taskStageSetting = myStageSetting;
        }

        // NOTE: stages for update
        if (stage.action_type !== PDF_TASK_PERSONAL_STATUS.send) {
          let newStage = {
            key: idx,
            name: stage.name,
            email: stage.email,
            stage_id: stage.stage_id,
            status: stage.action_type,
            isReadOnly:
              isMyTurn ||
              (stage.action_type !== PDF_TASK_PERSONAL_STATUS.processing &&
                stage.action_type !== PDF_TASK_PERSONAL_STATUS.initial),
            verify: stage.full_info.verify_methods,
          };
          if (taskStageSetting) {
            newStage = {
              ...newStage,
              ...taskStageSetting,
            };
          }
          stagesUpdate.push(newStage);
        }

        const newBlocks = [];
        const fieldGroups = [];

        stage.full_info.envelope_task_infos.map((envTskInfo) => {
          const {
            attachment_setting,
            field_settings,
            xfdf_text,
            field_setting_groups,
          } = envTskInfo;
          if (!xfdf_text) {
            return null;
          }

          // NOTE: set fieldGroups
          if (field_setting_groups && field_setting_groups.length > 0) {
            fieldGroups.push(...field_setting_groups);
          }

          // NOTE: attachments
          if (
            stage.action_type === PDF_TASK_PERSONAL_STATUS.processing &&
            isMyTurn
          ) {
            const envelope_file_id = envTskInfo.task_id;
            if (attachment_setting) {
              attachment_setting.forEach((atta) => {
                attachments.push({
                  ...atta,
                  stage_id: stage.stage_id,
                  envelope_file_id,
                });
              });
            }
          }

          let blocks = xfdf2Obj(xfdf_text, stage.action_type, isMyTurn);

          const readOnly =
            !isInvolved ||
            !isMyTurn ||
            stage.action_type !== PDF_TASK_PERSONAL_STATUS.processing ||
            (expires_in_days !== null && expires_in_days < 0);

          blocks.forEach((blk) => {
            const { img: blkImg, ...restBlk } = blk;
            void blkImg; // NOTE: unused variable

            // NOTE: get field setting
            const setting = field_settings?.find(
              (itm) => itm.field_object_id === blk.id,
            );

            const group = field_setting_groups.find(
              (g) => g.field_group_object_id === setting?.field_group_object_id,
            );

            // NOTE: options
            let blkOption = {};

            if (
              (setting !== undefined &&
                setting.options &&
                setting.options.force !== undefined) ||
              setting.field_type === fieldTypes.checkbox ||
              setting.field_type === fieldTypes.radio ||
              setting.field_type === fieldTypes.image ||
              setting.field_type === fieldTypes.link
            ) {
              blkOption = {
                options: {
                  ...setting.options,
                  read_only: group?.options.read_only,
                },
              };
            } else {
              // NOTE: may old ones
              blkOption = { options: { force: true } };
              if (blk.type === "textfield") {
                if (blk.is_date) {
                  blkOption.options.date_setting = "current_only";
                } else {
                  blkOption.options.is_multi_line = true;
                }
              }
            }

            // NOTE: handle block type, defaultPlaceholder, img
            let fieldType;
            let defaultPlaceholder;
            let img;
            if (setting?.field_type) {
              if (setting?.field_type === fieldTypes.sign) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_signature";
              } else if (setting?.field_type === fieldTypes.text) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_text";
              } else if (setting?.field_type === fieldTypes.date) {
                fieldType = fieldTypes.text;
                defaultPlaceholder = "input_date";
              } else if (setting?.field_type === fieldTypes.radio) {
                fieldType = fieldTypes.checkbox;
              } else if (setting?.field_type === fieldTypes.image) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_image";
                img = setting.field_value
                  ? res.data.image_info?.images?.find(
                      (info) => info.id === parseInt(setting.field_value),
                    )?.raw || null
                  : null;
              } else if (setting?.field_type === fieldTypes.link) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_link";
              } else {
                fieldType = setting.field_type;
              }
            }

            newBlocks.push({
              ...(setting?.field_type === fieldTypes.image
                ? { ...restBlk }
                : { ...blk }),
              ...blkOption,
              readOnly: readOnly || setting?.options?.read_only,
              coord: getMyCoord(
                blk.coord,
                vpDataMap[envTskInfo.task_id].viewport[blk.page - 1],
                vpDataMap[envTskInfo.task_id].rotates[blk.page - 1],
              ),
              field_group_object_id: setting?.field_group_object_id,
              type: fieldType,
              ...(defaultPlaceholder
                ? { defaultText: defaultPlaceholder }
                : {}),
              ...(envelope_id && { taskId: envTskInfo.task_id }),
              ...(img ? { img } : {}),
            });

            // NOTE: page Involver
            const blkItm = {
              order: idx,
              name: stage.name || stage.email,
              icon: (stage && stage.icon_url) || null,
              ...(envelope_id && { taskId: envTskInfo.task_id }),
            };
            if (!pageInvolvers[`page_${blk.page}`]) {
              pageInvolvers[`page_${blk.page}`] = [];
            }

            const isExist = pageInvolvers[`page_${blk.page}`].find((itm) => {
              return itm.order === blkItm.order && itm.name === blkItm.name;
            });
            if (!isExist) {
              pageInvolvers[`page_${blk.page}`] = [
                ...pageInvolvers[`page_${blk.page}`],
                blkItm,
              ];
            }
          });

          // NOTE: photo signatures
          field_settings.map((field) => {
            if (field?.photo_link) {
              photoSignatures.push({
                id: field.field_object_id,
                url: field.photo_link,
                email: stage.email,
              });
            }
          });
        });

        // NOTE: task blocks
        taskBlocks.push({
          order: idx,
          stageId: stage.stage_id,
          isMyTurn,
          status: stage.action_type,
          blocks: newBlocks,
          fieldGroups: fieldGroups,
        });
      });
    } else {
      // NOTE: single file sign task
      stage_infos.map((task, idx) => {
        const {
          attachment_setting,
          field_settings,
          xfdf_text,
          field_setting_groups,
        } = task.full_info;
        if (!xfdf_text) {
          return null;
        }

        const isMyTurn = task.name === "Me";

        // NOTE: attachments
        if (
          task.action_type === PDF_TASK_PERSONAL_STATUS.processing &&
          isMyTurn
        ) {
          if (attachment_setting) {
            attachments = attachment_setting.map((atta) => {
              return {
                ...atta,
                stage_id: task.stage_id,
              };
            });
          }
        }

        // NOTE: involved
        if (
          task.action_type &&
          task.action_type !== PDF_TASK_PERSONAL_STATUS.send
        ) {
          involved.push({
            key: idx,
            name: task.name,
            email: task.email,
          });
        }

        let blocks = xfdf2Obj(xfdf_text, task.action_type, isMyTurn);

        const readOnly =
          !isInvolved ||
          !isMyTurn ||
          task.action_type !== PDF_TASK_PERSONAL_STATUS.processing ||
          (expires_in_days !== null && expires_in_days < 0);

        let newBlocks = [];
        blocks.forEach((blk) => {
          const { img: blkImg, ...restBlk } = blk;
          void blkImg; // NOTE: unused variable

          // NOTE: options
          let blkOption = {};
          let setting;

          if (field_settings) {
            setting = field_settings.find(
              (itm) => itm.field_object_id === blk.id,
            );
          }

          if (
            (setting !== undefined &&
              setting.options &&
              setting.options.force !== undefined) ||
            setting.field_type === fieldTypes.checkbox ||
            setting.field_type === fieldTypes.radio ||
            setting.field_type === fieldTypes.image ||
            setting.field_type === fieldTypes.link
          ) {
            blkOption = { options: setting.options };
          } else {
            // NOTE: may old ones
            blkOption = { options: { force: true } };
            if (blk.type === "textfield") {
              if (blk.is_date) {
                blkOption.options.date_setting = "current_only";
              } else {
                blkOption.options.is_multi_line = true;
              }
            }
          }

          // NOTE: handle block type, defaultPlaceholder, img
          let fieldType;
          let defaultPlaceholder;
          let img;
          if (setting?.field_type) {
            if (setting?.field_type === fieldTypes.sign) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_signature";
            } else if (setting?.field_type === fieldTypes.text) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_text";
            } else if (setting?.field_type === fieldTypes.date) {
              fieldType = fieldTypes.text;
              defaultPlaceholder = "input_date";
            } else if (setting?.field_type === fieldTypes.radio) {
              fieldType = fieldTypes.checkbox;
            } else if (setting?.field_type === fieldTypes.image) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_image";
              img = setting.field_value
                ? res.data.image_info?.images?.find(
                    (info) => info.id === parseInt(setting.field_value),
                  )?.raw || null
                : null;
            } else if (setting?.field_type === fieldTypes.link) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_link";
            } else {
              fieldType = setting.field_type;
            }
          }

          newBlocks.push({
            ...(setting?.field_type === fieldTypes.image
              ? { ...restBlk }
              : { ...blk }),
            ...blkOption,
            readOnly: readOnly || setting?.options?.read_only,
            coord: getMyCoord(
              blk.coord,
              viewport[blk.page - 1],
              rotates[blk.page - 1],
            ),
            field_group_object_id: setting?.field_group_object_id,
            type: fieldType,
            ...(defaultPlaceholder ? { defaultText: defaultPlaceholder } : {}),
            ...(img ? { img } : {}),
          });

          // NOTE: page Involver
          const blkItm = {
            order: idx,
            name: task.name || task.email,
            icon: (task && task.icon_url) || null,
          };
          if (!pageInvolvers[`page_${blk.page}`]) {
            pageInvolvers[`page_${blk.page}`] = [];
          }

          const isExist = pageInvolvers[`page_${blk.page}`].find((itm) => {
            return itm.order === blkItm.order && itm.name === blkItm.name;
          });

          if (!isExist) {
            pageInvolvers[`page_${blk.page}`] = [
              ...pageInvolvers[`page_${blk.page}`],
              blkItm,
            ];
          }
        });

        // NOTE: stage setting
        let taskStageSetting;
        const myStageSetting = {
          forward_enable: true,
          decline_enable: false,
          viewable_in_processing: true,
          viewable_in_completed: true,
        };
        if (task.stage_setting) {
          taskStageSetting = task.stage_setting;
        }
        if (isMyTurn && own_by_me) {
          taskStageSetting = myStageSetting;
        }

        // NOTE: task blocks
        taskBlocks.push({
          order: idx,
          stageId: task.stage_id,
          isMyTurn,
          status: task.action_type,
          blocks: newBlocks,
          fieldGroups: field_setting_groups,
        });

        // NOTE: stages for update
        if (task.action_type !== PDF_TASK_PERSONAL_STATUS.send) {
          let newStage = {
            key: idx,
            name: task.name,
            email: task.email,
            stage_id: task.stage_id,
            status: task.action_type,
            isReadOnly:
              isMyTurn ||
              (task.action_type !== PDF_TASK_PERSONAL_STATUS.processing &&
                task.action_type !== PDF_TASK_PERSONAL_STATUS.initial),
            verify: task.full_info.verify_methods,
          };
          if (taskStageSetting) {
            newStage = {
              ...newStage,
              ...taskStageSetting,
            };
          }
          stagesUpdate.push(newStage);
        }

        // NOTE: photo signatures
        field_settings.map((field) => {
          if (field?.photo_link) {
            photoSignatures.push({
              id: field.field_object_id,
              url: field.photo_link,
              email: task.email,
            });
          }
        });
      });
    }

    if (envelope_id) {
      allFilesInvolvers = JSON.parse(JSON.stringify(pageInvolvers));

      pageInvolvers = filterPageInvolversByFileId(
        pageInvolvers,
        file_list[0].task_id,
      );
    }

    let payload = {
      isExpired: expires_in_days !== null && expires_in_days < 0,
      owner: owner_info.name,
      owner_email: owner_info.email,
      isMyTurn: current_member_turn,
      pageInvolvers,
      involved,
      taskBlocks,
      setup: {
        forget_remind,
        need_otp_verify,
        deadline: deadline ? unixToString(deadline, "yyyy/mm/dd", false) : null,
        expire_remind,
        remind_days_before_expire,
        receiver_lang,
        message,
      },
      stage_infos,
      decline_enable: false,
      forward_enable: false,
      declineReasons: decline_reasons,
      stagesUpdate,
      ccInfos: cc_info,
      filename: file_name,
      hideDropdownMenu: true,
      photoSignatures,
    };
    // NOTE: optional
    if (current_member_turn && attachments) {
      payload.attachments = attachments;
    }

    // NOTE: download original file info
    if (download_link) {
      payload.download_link = pdfDataUrl;
    }

    // NOTE: download complete file info
    if (complete_link) {
      payload.complete_link = complete_link;
    }

    if (envelope_id) {
      payload.isEnvelope = true;

      payload.fileList = envelopeFiles;

      payload.fileFocus = envelopeFiles[0];

      payload.allFilesInvolvers = allFilesInvolvers;
    }

    yield put({ type: signActions.GET_SIGN_TASK_SUC, payload });
  } catch (error) {
    console.log(error);
    const errorCovers = {
      400061: PREVIEW_SHARE_TASK_WARNING.invalidPreviewCode,
      404031: PREVIEW_SHARE_TASK_WARNING.taskNotFound,
      400033: PREVIEW_ERROR.fileDeleted,
      400046: PDF_TASK_WARNING.signSucc,
    };

    const coverType =
      error in coverTypes ? error : errorCovers[error] || COMMON_ERROR.error;

    yield put({
      type: commonActions.OPEN_COVER,
      payload: {
        coverType,
      },
    });
  }
}

function* getSignTask({ data }) {
  const { taskId, envelopeId, isFastSigning } = data;
  const getUser = (state) => state.auth.user;
  const user = yield select(getUser);

  try {
    const getTaskUuid = (state) => state.sign.taskUuid;
    const taskUuid = yield select(getTaskUuid);
    const getCode = (state) => state.sign.code;
    const code = data?.code ? data?.code : yield select(getCode);

    let toTransfer = {};

    if (taskId) {
      toTransfer.taskId = taskId;
    }
    if (envelopeId) {
      toTransfer.envelopeId = envelopeId;
    }
    if (code) {
      toTransfer.code = code;
    }
    if (taskUuid) {
      toTransfer.work_id = taskUuid;
    }

    const response = yield call(signApi.getSignTask, toTransfer);

    const res = yield call(checkOtpOnRead, { response, toTransfer });

    if (res.error_code === 401030) {
      // NOTE: registered, log in first
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          hint: AUTH_ERROR.loginFirst,
          task_id: taskId,
          envelope_id: envelopeId,
        },
      });
      return null;
    } else if (
      res.error_code === 403037 &&
      res.task_status === PDF_TASK_STATUS.completed
    ) {
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          isSigningDone: true,
          warning: PDF_TASK_WARNING.guestSignSucc,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: {
          coverType: PDF_TASK_WARNING.guestSignSucc,
        },
      });
      return null;
    } else if (res.error_code === 403037) {
      // NOTE: quick sign required agreement
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: { isFastSigning: true, code },
      });

      // NOTE: fake user if fast signing
      const fakeUser = {
        isVerified: true,
        confirmed: true,
        isFake: true,
        name: res.signer_name,
        email: res.signer_email,
        qsOwnerEmail: res.owner_email,
      };

      yield put({
        type: authActions.SET_USER,
        payload: { user: fakeUser },
      });

      // NOTE: open consent
      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.consent,
          modalData: {
            confirmData: postFastSigningConsentAction({ isChecked: true }),
          },
        },
      });
      return null;
    } else if (res.error_code === 403036) {
      // NOTE: task not accessible
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          warning: PDF_TASK_WARNING.accessDeny,
        },
      });
      return null;
    } else if (res.error_code === 400002) {
      // NOTE: stage already finished
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          hint: AUTH_ERROR.loginFirst,
          task_id: taskId,
          envelope_id: envelopeId,
        },
      });
      return null;
    } else if (res.error_code === 403040) {
      // NOTE: been forwarded
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          warning: PDF_TASK_WARNING.beenForwarded,
        },
      });
      return null;
    } else if (res.error_code === 403035) {
      // NOTE: code expired
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          warning: PDF_TASK_WARNING.codeExpired,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: {
          coverType: PDF_TASK_WARNING.codeExpired,
        },
      });
      return null;
    } else if (res.error_code === 400900) {
      // NOTE: group expired
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: res.task_status,
          hint: GROUP_HINT.taskSuspended,
          task_id: taskId,
          envelope_id: envelopeId,
        },
      });
      return null;
    } else if (res.error_code === 400086) {
      throw res.error_code;
    } else if (res.error_code === 403048) {
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          hint: PDF_TASK_HINT.declined,
        },
      });
      return null;
    }

    if (res.error_code === 400033) {
      yield put({
        type: signActions.GET_SIGN_TASK_FAL,
        payload: {
          signTaskStatus: res.task_status,
          warning: PREVIEW_ERROR.fileDeleted,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: {
          coverType: PDF_TASK_WARNING.taskDeleted,
        },
      });
      return null;
    }

    if (res.error_code === 400046) {
      yield put({
        type: signActions.GET_SIGN_TASK_FAL,
        payload: {
          signTaskStatus: res.task_status,
          warning: PDF_TASK_WARNING.signSucc,
          viewable_attachments: res.viewable_attachments,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: {
          coverType: PDF_TASK_WARNING.signSucc,
        },
      });
      return null;
    }

    const {
      attachment_link,
      task_owner_info,
      envelope_owner_info,
      stage_infos,
      task_id,
      envelope_id,
      current_stage_ids,
      current_member_turn,
      forget_remind,
      need_otp_verify,
      deadline,
      expire_remind,
      remind_days_before_expire,
      receiver_lang,
      message,
      completed_message,
      expires_in_days,
      download_link,
      complete_link,
      file_name,
      envelope_name,
      identity_verify_token,
      navbar,
      pdf,
      hint,
      resultType,
      reference_links,
      completed_reference_links,
      reference_setting,
      completed_reference_setting,
      task_infos: file_list,
      cc_info,
      review_info,
    } = res.data;

    // NOTE: ===
    const task_status = res.data.status;
    const isReviewing = res.data?.access_info?.review === "accessible";
    const isReviewed = res.data?.access_info?.confirm;
    const owner_info = task_owner_info || envelope_owner_info;
    const own_by_me = owner_info.name === "Me";
    const isEnvelope = !!envelope_id;

    const isInvolved = res.data.stage_infos.find((step) => step.name === "Me");
    // NOTE: NOT logged in, completed
    if (!user && task_status === PDF_TASK_STATUS.completed) {
      throw PDF_TASK_WARNING.loginFirst;
    }
    // NOTE: NOT security-verified, completed
    if (user && !user.confirmed && task_status === PDF_TASK_STATUS.completed) {
      if (!isInvolved) {
        throw PDF_TASK_WARNING.accessDeny;
      } else {
        throw AUTH_ERROR.needConfirm;
      }
    }
    // NOTE: NOT security-verified, in process
    if (user && !user.confirmed && task_status !== PDF_TASK_STATUS.completed) {
      if (!isInvolved) {
        // NOTE: NOT involved
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            hint: PDF_TASK_HINT.deny,
          },
        });
      } else {
        // NOTE: involved
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            hint: AUTH_ERROR.needConfirm,
          },
        });
      }
      return null;
    }

    const fileUrl = isEnvelope
      ? file_list[0].download_link
      : (yield select((state) => state.create.fileUrl)) || download_link;

    let pdfDataUrl;
    let vpData;
    let envelopeFiles;

    if (isEnvelope) {
      envelopeFiles = yield all(
        file_list.map((file) =>
          call(fetchFileData, { file, isGetSignTask: true }),
        ),
      );
      pdfDataUrl = envelopeFiles[0].fileUrl;
      vpData = envelopeFiles[0].vpData;
    } else {
      const doc = yield call(getDoc, fileUrl);
      pdfDataUrl = yield call(getPdfDocDataURL, doc);
      vpData = yield call(getAllViewport, doc);
    }

    if (!vpData) {
      throw COMMON_ERROR.error;
    }

    // NOTE: set fileUrl for PdfViewer
    yield put({
      type: signActions.SET_FILE_URL,
      payload: {
        url: pdfDataUrl,
      },
    });

    const { viewport, rotates } = vpData;

    let pageInvolvers = {};
    let allFilesInvolvers = {};
    let involved = []; // NOTE: for task info update (change signer)
    let taskBlocks = [];
    let reviewFields = null; // NOTE: for review only
    let reviewedAttachments = null;
    let reviewedAttachmentsMap = new Map();
    let reviewedMessage = null; // NOTE: for review only
    let reviewResults = null; // NOTE: for modify from checking
    let modifyStageId = null; // NOTE: for modify from checking
    let modifyFieldSettings = null; // NOTE: for modify from checking
    let attachments;
    let stagesUpdate = [];
    let msgRequestReceivers = [];
    let msgCompletedReceivers = [];
    let photoSignatures = [];

    // NOTE: review info
    if (review_info) {
      const { reviewed_message, reviewed_attachments } = review_info;

      reviewedMessage = reviewed_message || null;

      reviewedAttachmentsMap = new Map(
        reviewed_attachments?.map((atta) => [atta.attachment_id, atta]) || [],
      );
    }

    // NOTE: review related, checker
    if (isReviewing) {
      const {
        reviewed_at,
        reviewed_by,
        reviewed_fields,
        signed_fields,
        signed_attachments,
      } = review_info;
      const isFirstTimeReview =
        !reviewed_at && !reviewed_by && !reviewed_fields?.length;
      const reviewedFieldsMap = new Map(
        reviewed_fields?.map((field) => [field.field_object_id, field]),
      );
      const signedFieldsMap = new Map(
        signed_fields?.map((field) => [field.field_object_id, field]) || [],
      );
      const signedAttachmentsMap = new Map(
        signed_attachments?.map((signedAttachment) => [
          signedAttachment.attachment_id,
          signedAttachment,
        ]) || [],
      );

      // NOTE: for old review task to find current reviewed stage
      const currentStage = stage_infos.find(
        (stg) =>
          stg.name === "Me" &&
          stg.action === STAGE_ACTION.review &&
          current_stage_ids.includes(stg?.stage_id),
      );
      stage_infos.map((stg, idx) => {
        if (stg.action_type !== PDF_TASK_PERSONAL_STATUS.signed) {
          return;
        }
        // NOTE: non-order scheme, multi-review fields, only the first one
        if (reviewFields) {
          return;
        }

        const signerStageId = currentStage.actor_info?.base_stage_id;
        if (stg.stage_id === signerStageId) {
          reviewFields = stg.full_info.field_settings.map((field, indx) => {
            const reviewedField = reviewedFieldsMap.get(field.field_object_id);
            const signedField = signedFieldsMap.get(field.field_object_id);
            const [isLastTimeFailed, isLastTimeChanged] = (() => {
              if (isFirstTimeReview) {
                return [false, false];
              }
              // NOTE: for old review task, set all false
              if (!reviewedField || !signedField) {
                return [false, false];
              }
              const isFailed = reviewedField.accepted === false;
              const isChanged = signedField.changed;
              return [isFailed, isChanged];
            })();

            return {
              seq: idx,
              order: indx,
              page: field.page,
              pdf_object_id: field.field_object_id,
              field_type: field.field_type,
              field_value: field.field_value,
              isLastTimeChanged,
              isLastTimeFailed,
              coord: getMyCoord(
                field.coord,
                viewport[field.page],
                rotates[field.page],
              ),
            };
          });

          reviewedAttachments = res.data.viewable_attachments.map(
            (viewableAttachment) => {
              const attachmentId = viewableAttachment.attachment_id;
              const reviewedAttachment =
                reviewedAttachmentsMap.get(attachmentId);
              const signedAttachment = signedAttachmentsMap.get(attachmentId);
              const [isLastTimeFailed, isLastTimeChanged] = (() => {
                if (isFirstTimeReview) {
                  return [false, false];
                }
                // NOTE: for old review task, set all false
                if (!reviewedAttachment || !signedAttachment) {
                  return [false, false];
                }
                const isFailed = reviewedAttachment.accepted === false;
                const isChanged = signedAttachment.changed;
                return [isFailed, isChanged];
              })();

              return {
                ...viewableAttachment,
                isLastTimeChanged,
                isLastTimeFailed,
              };
            },
          );
        }
      });
    }

    if (envelope_id) {
      attachments = [];

      let vpDataMap = {};

      for (const envelopeFile of envelopeFiles) {
        if (!envelopeFile.vpData) {
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.revertDraftFal,
          });
          yield delay(5000);
          yield call(Router.push, "/tasks");
          throw new Error(
            `Viewport data not found for task_id: ${envelopeFile.fileId}`,
          );
        }

        vpDataMap[envelopeFile.fileId] = envelopeFile.vpData;
      }

      stage_infos.map((stage, idx) => {
        const isMyTurn = stage.name === "Me";

        const assigne = {
          email: stage.email,
          isMe: isMyTurn,
          key: idx,
          name: stage.name,
          stage_setting: stage.full_info.stage_setting,
        };

        const { completed_viewable, processing_viewable } =
          stage.full_info.custom_message_setting;

        if (processing_viewable) {
          msgRequestReceivers.push(assigne);
        }
        if (completed_viewable) {
          msgCompletedReceivers.push(assigne);
        }

        // NOTE: involved
        if (
          stage.action_type &&
          stage.action_type !== PDF_TASK_PERSONAL_STATUS.send
        ) {
          involved.push({
            key: idx,
            name: stage.name,
            email: stage.email,
          });
        }

        // NOTE: stage setting
        let taskStageSetting;
        const myStageSetting = {
          forward_enable: true,
          decline_enable: false,
          viewable_in_processing: true,
          viewable_in_completed: true,
        };
        if (stage.stage_setting) {
          taskStageSetting = stage.stage_setting;
        }
        if (isMyTurn && own_by_me) {
          taskStageSetting = myStageSetting;
        }

        // NOTE: stages for update
        if (stage.action_type !== PDF_TASK_PERSONAL_STATUS.send) {
          let newStage = {
            key: idx,
            name: stage.name,
            email: stage.email,
            stage_id: stage.stage_id,
            status: stage.action_type,
            isReadOnly:
              isMyTurn ||
              (stage.action_type !== PDF_TASK_PERSONAL_STATUS.processing &&
                stage.action_type !== PDF_TASK_PERSONAL_STATUS.initial),
            verify: stage.full_info.verify_methods,
          };
          if (taskStageSetting) {
            newStage = {
              ...newStage,
              ...taskStageSetting,
            };
          }
          stagesUpdate.push(newStage);
        }

        const newBlocks = [];
        const fieldGroups = [];

        stage.full_info.envelope_task_infos.map((envTskInfo) => {
          const {
            attachment_setting,
            field_settings,
            xfdf_text,
            field_setting_groups,
            task_id,
          } = envTskInfo;
          if (!xfdf_text) {
            return null;
          }

          // NOTE: set fieldGroups
          if (field_setting_groups && field_setting_groups.length > 0) {
            fieldGroups.push(
              ...field_setting_groups.map((g) => ({ ...g, taskId: task_id })),
            );
          }

          // NOTE: attachments
          if (
            stage.action_type === PDF_TASK_PERSONAL_STATUS.processing &&
            isMyTurn
          ) {
            const envelope_file_id = envTskInfo.task_id;
            if (attachment_setting) {
              attachment_setting.forEach((atta) => {
                attachments.push({
                  ...atta,
                  stage_id: stage.stage_id,
                  envelope_file_id, // TODO: refactor, check whether to use a unified key (task_id or envelope_file_id)
                });
              });
            }
          }

          let blocks = xfdf2Obj(xfdf_text, stage.action_type, isMyTurn);

          const readOnly =
            !isInvolved ||
            !isMyTurn ||
            stage.action_type !== PDF_TASK_PERSONAL_STATUS.processing ||
            (expires_in_days !== null && expires_in_days < 0);

          blocks.forEach((blk) => {
            const { img: blkImg, ...restBlk } = blk;
            void blkImg; // NOTE: unused variable

            // NOTE: get field setting
            const setting = field_settings?.find(
              (itm) => itm.field_object_id === blk.id,
            );

            const group = field_setting_groups.find(
              (g) => g.field_group_object_id === setting?.field_group_object_id,
            );

            // NOTE: handle block options
            let blkOption = {};
            if (
              (setting !== undefined &&
                setting.options &&
                setting.options.force !== undefined) ||
              setting.field_type === fieldTypes.checkbox ||
              setting.field_type === fieldTypes.radio ||
              setting.field_type === fieldTypes.image ||
              setting.field_type === fieldTypes.link
            ) {
              blkOption = {
                options: {
                  ...setting.options,
                  read_only: group?.options.read_only,
                },
              };
            } else {
              // NOTE: may old ones
              blkOption = { options: { force: true } };
              if (blk.type === fieldTypes.text) {
                if (blk.is_date) {
                  blkOption.options.date_setting = "current_only";
                } else {
                  blkOption.options.is_multi_line = true;
                }
              }
            }

            // NOTE: handle block type, defaultPlaceholder, img
            let fieldType;
            let defaultPlaceholder;
            let img;
            if (setting?.field_type) {
              if (setting?.field_type === fieldTypes.sign) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_signature";
              } else if (setting?.field_type === fieldTypes.text) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_text";
              } else if (setting?.field_type === fieldTypes.date) {
                fieldType = fieldTypes.text;
                defaultPlaceholder = "input_date";
              } else if (setting?.field_type === fieldTypes.radio) {
                fieldType = fieldTypes.checkbox;
              } else if (setting?.field_type === fieldTypes.image) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_image";
                img = setting.field_value
                  ? res.data.image_info?.images?.find(
                      (info) => info.id === parseInt(setting.field_value),
                    )?.raw || null
                  : null;
              } else if (setting?.field_type === fieldTypes.link) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_link";
              } else {
                fieldType = setting.field_type;
              }
            }

            newBlocks.push({
              ...(fieldType === fieldTypes.image ? { ...restBlk } : { ...blk }),
              ...blkOption,
              readOnly: readOnly || setting?.options?.read_only,
              coord: getMyCoord(
                blk.coord,
                vpDataMap[envTskInfo.task_id].viewport[blk.page - 1],
                vpDataMap[envTskInfo.task_id].rotates[blk.page - 1],
              ),
              ...(envelope_id && { taskId: envTskInfo.task_id }),
              field_group_object_id: setting?.field_group_object_id,
              type: fieldType,
              ...(defaultPlaceholder
                ? { defaultText: defaultPlaceholder }
                : {}),
              ...(img ? { img } : {}),
            });

            // NOTE: page Involver
            const blkItm = {
              order: idx,
              name: stage.name || stage.email,
              icon: (stage && stage.icon_url) || null,
              ...(envelope_id && { taskId: envTskInfo.task_id }),
            };
            if (!pageInvolvers[`page_${blk.page}`]) {
              pageInvolvers[`page_${blk.page}`] = [];
            }

            const isExist = pageInvolvers[`page_${blk.page}`].find((itm) => {
              return itm.order === blkItm.order && itm.name === blkItm.name;
            });

            if (!isExist) {
              pageInvolvers[`page_${blk.page}`] = [
                ...pageInvolvers[`page_${blk.page}`],
                blkItm,
              ];
            }
          });

          // NOTE: photo signatures
          field_settings.map((field) => {
            if (field?.photo_link) {
              photoSignatures.push({
                id: field.field_object_id,
                url: field.photo_link,
                email: stage.email,
              });
            }
          });
        });

        // NOTE: task blocks
        taskBlocks.push({
          order: idx,
          stageId: stage.stage_id,
          isMyTurn,
          status: stage.action_type,
          blocks: newBlocks,
          fieldGroups: fieldGroups,
        });
      });
    } else {
      stage_infos.map((task, idx) => {
        if (task.action === STAGE_ACTION.review) {
          return null;
        }

        const {
          attachment_setting,
          field_settings,
          xfdf_text,
          field_setting_groups,
        } = task.full_info;

        if (!xfdf_text) {
          return null;
        }

        const isMyTurn = task.name === "Me";
        const { completed_viewable, processing_viewable } =
          task.full_info.custom_message_setting;

        const assigne = {
          action: task.action,
          email: task.email,
          isMe: isMyTurn,
          key: idx,
          name: task.name,
          stage_setting: task.full_info.stage_setting,
        };

        if (isMyTurn) {
          // NOTE: modifying, returned from checker
          if (
            task.action_type === PDF_TASK_PERSONAL_STATUS.modifying &&
            review_info
          ) {
            reviewResults = {
              ...review_info,
              reviewed_fields:
                review_info.reviewed_fields?.map((stg) => ({
                  ...stg,
                  pdf_object_id: stg.field_object_id,
                  field_type: stg?.field_type,
                })) || [],
            };
            modifyStageId = task.stage_id;
            modifyFieldSettings = task.full_info.field_settings.map((field) => {
              return {
                ...field,
                pdf_object_id: field.pdf_object_id,
              };
            });
          }

          // NOTE: attachments
          if (
            (task.action_type === PDF_TASK_PERSONAL_STATUS.processing ||
              task.action_type === PDF_TASK_PERSONAL_STATUS.modifying) &&
            isMyTurn
          ) {
            if (attachment_setting) {
              attachments = attachment_setting.map((atta) => {
                const attachmentId = atta.attachment_id;
                const reviewedAttachment =
                  reviewedAttachmentsMap.get(attachmentId);
                return {
                  ...atta,
                  stage_id: task.stage_id,
                  accepted: reviewedAttachment?.accepted,
                };
              });
            }
          }
        }

        // NOTE: involved
        if (
          task.action_type &&
          task.action_type !== PDF_TASK_PERSONAL_STATUS.send
        ) {
          involved.push({
            key: idx,
            name: task.name,
            email: task.email,
          });
        }

        if (processing_viewable) {
          msgRequestReceivers.push(assigne);
        }
        if (completed_viewable) {
          msgCompletedReceivers.push(assigne);
        }

        let blocks = xfdf2Obj(xfdf_text, task.action_type, isMyTurn);

        const readOnly =
          !isInvolved ||
          !isMyTurn ||
          task.action_type !== PDF_TASK_PERSONAL_STATUS.processing ||
          (expires_in_days !== null && expires_in_days < 0);

        let newBlocks = [];

        blocks.forEach((blk) => {
          const { img: blkImg, ...restBlk } = blk;
          void blkImg; // NOTE: unused variable

          // NOTE: get field setting
          const setting = field_settings?.find(
            (itm) => itm.field_object_id === blk.id,
          );

          const group = field_setting_groups.find(
            (g) => g.field_group_object_id === setting?.field_group_object_id,
          );

          // NOTE: handle block options
          let blkOption = {};
          if (
            (setting !== undefined &&
              setting.options &&
              setting.options.force !== undefined) ||
            setting.field_type === fieldTypes.checkbox ||
            setting.field_type === fieldTypes.radio ||
            setting.field_type === fieldTypes.image ||
            setting.field_type === fieldTypes.link
          ) {
            blkOption = {
              options: {
                ...setting.options,
                read_only: group?.options.read_only,
              },
            };
          } else {
            // NOTE: may old ones
            blkOption = { options: { force: true } };
            if (blk.type === fieldTypes.text) {
              if (blk.is_date) {
                blkOption.options.date_setting = "current_only";
              } else {
                blkOption.options.is_multi_line = true;
              }
            }
          }

          // NOTE: handle block type, defaultPlaceholder, img
          let fieldType;
          let defaultPlaceholder;
          let img;
          if (setting?.field_type) {
            if (setting?.field_type === fieldTypes.sign) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_signature";
            } else if (setting?.field_type === fieldTypes.text) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_text";
            } else if (setting?.field_type === fieldTypes.date) {
              fieldType = fieldTypes.text;
              defaultPlaceholder = "input_date";
            } else if (setting?.field_type === fieldTypes.radio) {
              fieldType = fieldTypes.checkbox;
            } else if (setting?.field_type === fieldTypes.image) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_image";
              img = setting.field_value
                ? res.data.image_info?.images?.find(
                    (info) => info.id === parseInt(setting.field_value),
                  )?.raw || null
                : null;
            } else if (setting?.field_type === fieldTypes.link) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_link";
            } else {
              fieldType = setting.field_type;
            }
          }

          newBlocks.push({
            ...(fieldType === fieldTypes.image ? { ...restBlk } : { ...blk }),
            ...blkOption,
            readOnly: readOnly || setting?.options?.read_only,
            coord: getMyCoord(
              blk.coord,
              viewport[blk.page - 1],
              rotates[blk.page - 1],
            ),
            field_group_object_id: setting?.field_group_object_id,
            type: fieldType,
            ...(defaultPlaceholder ? { defaultText: defaultPlaceholder } : {}),
            ...(img ? { img } : {}),
          });

          // NOTE: page Involver
          const blkItm = {
            order: idx,
            name: task.name || task.email,
            icon: (task && task.icon_url) || null,
          };
          if (!pageInvolvers[`page_${blk.page}`]) {
            pageInvolvers[`page_${blk.page}`] = [];
          }

          const isExist = pageInvolvers[`page_${blk.page}`].find((itm) => {
            return itm.order === blkItm.order && itm.name === blkItm.name;
          });

          if (!isExist) {
            pageInvolvers[`page_${blk.page}`] = [
              ...pageInvolvers[`page_${blk.page}`],
              blkItm,
            ];
          }
        });

        // NOTE: stage setting
        let taskStageSetting;
        const myStageSetting = {
          forward_enable: true,
          decline_enable: false,
          viewable_in_processing: true,
          viewable_in_completed: true,
        };
        if (task.stage_setting) {
          taskStageSetting = task.stage_setting;
        }
        if (isMyTurn && own_by_me) {
          taskStageSetting = myStageSetting;
        }

        // NOTE: task blocks
        taskBlocks.push({
          order: idx,
          stageId: task.stage_id,
          isMyTurn,
          status: task.action_type,
          blocks: newBlocks,
          fieldGroups: field_setting_groups,
        });

        // NOTE: stages for update
        if (task.action_type !== PDF_TASK_PERSONAL_STATUS.send) {
          let newStage = {
            key: idx,
            name: task.name,
            email: task.email,
            stage_id: task.stage_id,
            status: task.action_type,
            isReadOnly:
              isMyTurn ||
              (task.action_type !== PDF_TASK_PERSONAL_STATUS.processing &&
                task.action_type !== PDF_TASK_PERSONAL_STATUS.initial),
            verify: task.full_info.verify_methods,
          };
          if (taskStageSetting) {
            newStage = {
              ...newStage,
              ...taskStageSetting,
            };
          }
          stagesUpdate.push(newStage);
        }

        // NOTE: photo signatures
        field_settings.map((field) => {
          if (field?.photo_link) {
            photoSignatures.push({
              id: field.field_object_id,
              url: field.photo_link,
              email: task.email,
            });
          }
        });
      });
    }

    if (envelope_id) {
      allFilesInvolvers = JSON.parse(JSON.stringify(pageInvolvers));

      pageInvolvers = filterPageInvolversByFileId(
        pageInvolvers,
        file_list[0].task_id,
      );
    }

    const currentStage = stage_infos.find(
      (data) =>
        data.name === "Me" && current_stage_ids.includes(data?.stage_id),
    );

    const isShowOnBackHint =
      task_status === PDF_TASK_STATUS.completed ||
      task_status === PDF_TASK_STATUS.expired;

    let payload = {
      task_id,
      envelope_id,
      stage_id: currentStage?.stage_id,
      isFastSigning,
      isSigningDone: isShowOnBackHint,
      identityVerifyToken: identity_verify_token,
      isExpired: expires_in_days !== null && expires_in_days < 0,
      owner: owner_info.name,
      owner_email: owner_info.email,
      isOwner: own_by_me,
      isMyTurn: current_member_turn,
      pageInvolvers,
      involved,
      hint,
      resultType,
      taskBlocks,
      setup: {
        forget_remind,
        need_otp_verify,
        deadline: deadline ? unixToString(deadline, "yyyy/mm/dd", false) : null,
        expire_remind,
        remind_days_before_expire,
        receiver_lang,
        message,
        completed_message,
      },
      stage_infos,
      viewable_attachments: res.data.viewable_attachments,
      stagesUpdate,
      filename: file_name,
      envelopeName: envelope_name,
      navbar,
      pdf,
      reviewFields,
      reviewedAttachments,
      reviewedMessage,
      reviewResults,
      isReviewPassed: isReviewed,
      completed_reference_setting,
      msgRequestReceivers,
      msgCompletedReceivers,
      ccInfos: cc_info,
      photoSignatures,
    };

    // NOTE: optional
    if (current_member_turn && attachments) {
      payload.attachments = attachments;
    }

    // NOTE: download info
    if (download_link) {
      payload.download_link = pdfDataUrl;
    }

    // NOTE: download complete file info
    if (complete_link) {
      payload.complete_link = complete_link;
    }

    // NOTE: attachment link
    if (attachment_link) {
      payload.attachment_link = attachment_link;
    }

    // NOTE: reference
    if (reference_setting) {
      payload.reference_setting = reference_setting;
      payload.message = message;
      payload.reference_links = reference_links;
    }

    // NOTE: completed_reference
    if (completed_reference_setting) {
      payload.completed_reference_setting = completed_reference_setting;
      payload.completed_message = completed_message;
      payload.completed_reference_links = completed_reference_links;
    }

    // NOTE: isEnvelope
    if (envelope_id) {
      payload.isEnvelope = true;

      payload.fileList = envelopeFiles;

      payload.fileFocus = envelopeFiles[0];

      payload.allFilesInvolvers = allFilesInvolvers;
    }

    yield put({ type: signActions.GET_SIGN_TASK_SUC, payload });

    // NOTE: handle myTurn default value
    const currentWorkingStage = taskBlocks.find(
      (stg) =>
        stg.status === PDF_TASK_PERSONAL_STATUS.processing && stg.isMyTurn,
    );

    if (currentWorkingStage !== undefined) {
      const blocks = currentWorkingStage.blocks;

      let blkWithDefault = [];

      // NOTE: handle blocks
      blocks.map((field) => {
        let obj;
        let type = field.type;

        // NOTE: determine type
        if (field.type === "textfield" && field.is_date) {
          type = "datefield";
        }
        if (
          (field.type === "checkbox" && field.style === 1) ||
          field.type === "radio"
        ) {
          type = "radio";
        }

        // NOTE: create obj based on type
        switch (type) {
          case "textfield":
            obj = {
              category: "textfield",
              raw: field.options.default || "",
            };
            break;

          case "datefield":
            obj = {
              category: "textfield",
              date_format: field.options.date_format || "yyyy/mm/dd",
              raw: field.options.default || null,
              is_date: true,
            };
            break;

          case "radio":
            obj = {
              category: "checkbox",
              raw: field.options.default || false,
              style: 1,
            };
            break;

          case "checkbox":
            obj = {
              category: "checkbox",
              raw: field.options.default || false,
              style: 0,
            };
            break;

          case "link":
            obj = {
              category: "link",
              raw: field.options.default || "",
            };
            break;

          case "image":
            obj = {
              category: "image",
              raw: null,
            };
            break;

          default:
            break;
        }

        if (obj) {
          blkWithDefault.push({
            stageid: currentWorkingStage.stageId,
            blockid: field.id,
            changed: false,
            options: field.options,
            field_group_object_id: field.field_group_object_id,
            obj,
            ...(isEnvelope ? { taskId: field.taskId } : {}),
          });
        }
      });

      // NOTE: update appliedSigns default
      if (blkWithDefault.length > 0) {
        yield put({
          type: signActions.UPDATE_APPLIED_SIGNS_SUC,
          payload: blkWithDefault,
        });
      }
    }

    // NOTE: for modifying, set default appliedSigns, atts.
    if (reviewResults) {
      let blkWithDefault = [];

      // NOTE: handle blocks
      modifyFieldSettings.forEach((blk) => {
        let obj = {};
        switch (blk.field_type) {
          case "signature": {
            const raw = (() => {
              const signId = parseInt(blk.field_value);

              const infos = (() => {
                if (!res?.data?.signature_info) {
                  return null;
                }

                if (blk.field_value_type === "guest_signature") {
                  return res.data.signature_info.guest_signatures;
                }

                if (blk.field_value_type === "seal") {
                  return res.data.signature_info.seals;
                }

                return res.data.signature_info.signatures;
              })();

              const itm = infos?.find((info) => info.id === signId);

              return typeof itm === "undefined" ? null : itm.raw;
            })();

            obj = {
              category: blk.field_value_type,
              id: parseInt(blk.field_value),
              raw,
            };
            break;
          }

          case "textfield":
            obj = {
              category: "textfield",
              raw: blk.field_value || "",
            };
            break;

          case "datefield":
            obj = {
              category: "textfield",
              date_format: blk.options.date_format || "yyyy/mm/dd",
              raw: blk.field_value || null,
              zone: 8,
              is_date: true,
            };
            break;

          case "radio":
            obj = {
              category: "checkbox",
              raw: blk.field_value === "t" || blk.field_value === true,
              style: 1,
            };
            break;

          case "checkbox":
            obj = {
              category: "checkbox",
              raw: blk.field_value === "t" || blk.field_value === true,
              style: 0,
            };
            break;

          case "image": {
            const image_id = parseInt(blk.field_value);
            const itm = res.data.image_info.images?.find(
              (info) => info.id === image_id,
            );
            const raw = itm ? itm.raw : null;

            obj = {
              category: "image",
              file_type: "png",
              image_id,
              raw,
            };
            break;
          }

          case "link":
            obj = {
              category: "link",
              raw: blk.field_value || "",
            };
            break;

          default:
            return {};
        }

        if (obj) {
          // NOTE: signature cleared on modify
          const changed = blk.field_type === "signature";
          blkWithDefault.push({
            stageid: modifyStageId,
            blockid: blk.field_object_id,
            changed,
            options: blk.options,
            field_group_object_id: blk.field_group_object_id,
            obj,
          });
        }
      });

      yield put({
        type: signActions.UPDATE_APPLIED_SIGNS_SUC,
        payload: blkWithDefault,
      });

      if (attachments) {
        const newAttachments = [];
        attachments.map((att) => {
          let attNew = { ...att };

          if (att.file_name) {
            attNew = {
              ...att,
              changed: false,
              preview: att.thumbnail && att.thumbnail.cover_175,
              file: {
                name: att.file_name,
                type: "image/jpeg",
              },
              isUploaded: true,
            };
          }

          newAttachments.push(attNew);
        });

        yield put({
          type: signActions.SET_ATTACHMENTS_UPLOADED,
          payload: newAttachments,
        });
      }
    }
  } catch (error) {
    console.log(error);

    const coverType = error in coverTypes ? error : COMMON_ERROR.error;

    yield put({
      type: commonActions.OPEN_COVER,
      payload: {
        coverType,
      },
    });
  }
}

function* putSignTask({ payload }) {
  try {
    // NOTE: ini: task_id, signs
    // NOTE: backup: task_id, data
    const {
      task_id,
      envelope_id,
      signs,
      data,
      isAttaUploaded, // NOTE: only when atta uploaded
    } = payload;

    let toPass = {};
    if (signs && !data) {
      let stageSigns = [];
      signs.map((sign) => {
        const isSignature =
          sign.obj.category === SIGNATURE_CATEGORY.SIGNATURE ||
          sign.obj.category === SIGNATURE_CATEGORY.INITIAL ||
          sign.obj.category === SIGNATURE_CATEGORY.STAMP ||
          sign.obj.category === SIGNATURE_CATEGORY.GUEST_SIGNATURE ||
          sign.obj.category === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO;

        const isImage = sign.obj.category === "image";

        const getStageType = () => {
          if (
            isSignature &&
            sign.obj.category === SIGNATURE_CATEGORY.GUEST_SIGNATURE
          ) {
            return "guest_signature";
          } else if (isSignature) {
            return "signature";
          } else {
            return sign.obj.category;
          }
        };

        const getValue = () => {
          if (isSignature) {
            return sign.obj.id;
          } else if (isImage) {
            return sign.obj.image_id;
          } else {
            return sign.obj.raw;
          }
        };

        let stageTemp = {
          object_id: sign.blockid,
          type: getStageType(),
          value: getValue(),
          changed: sign.changed,
        };

        const shouldSkip = (isSignature || isImage) && !stageTemp.value;

        if (shouldSkip) {
          return;
        }

        const optionKey = [
          "style",
          "date_format",
          "zone",
          "alignment",
          "font_size",
        ];
        optionKey.forEach((key) => {
          if (typeof sign.options[key] !== "undefined") {
            stageTemp[key] = sign.options[key];
          }
        });

        stageSigns.push(stageTemp);
      });

      toPass = {
        data: {
          client: "web",
          ...(envelope_id ? { envelope_id } : { sign_task_id: task_id }),
          signature_info: stageSigns,
        },
      };
    } else {
      toPass = payload;
    }

    // NOTE: put sign

    const getTask = (state) => state.sign;
    const {
      taskUuid,
      attachments,
      code,
      identityVerifyToken,
      isFastSigning,
      reviewResults,
    } = yield select(getTask);

    if (code) {
      toPass.data.code = code;
    }
    if (taskUuid) {
      toPass.data.work_id = taskUuid;
    }
    if (identityVerifyToken) {
      toPass.data.identity_verify_token = identityVerifyToken;
    }
    if (attachments) {
      let info_atta = [];
      attachments.map((atta) => {
        if (atta.file) {
          info_atta.push({
            attachment_id: atta.attachment_id,
            attachment_type: getImageFormat(atta.file.type),
            uploaded: isAttaUploaded ? true : atta.isUploaded,
            changed: atta.changed,
          });
        }
      });
      toPass.data.attachment_info = info_atta;
    }

    const response = yield call(signApi.putSigns, toPass);
    const resp = yield call(checkOtpOnSend, { response, toTransfer: toPass });

    if (resp.error_code && resp.error_message) {
      yield put({ type: signActions.PUT_SIGN_TASK_FAL });

      if (resp.error_code === 404045) {
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.systemCAFailed,
        });
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            warning: PDF_TASK_WARNING.caFailed,
          },
        });
      } else if (resp.error_code === 403033) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.otpSourceNotSet,
        });
      } else if (resp.error_code === 406032) {
        // NOTE: otp, invalid contact information
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.contactInvalid,
          },
        });
      } else if (resp.error_code === 400049) {
        // NOTE: qs, duplicate tabs
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.duplicateWorkingState,
          },
        });
      } else if (resp.error_code === 400033) {
        // NOTE: task Deleted
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.taskDeleted,
          },
        });
      } else if (resp.error_code === 404030) {
        // NOTE: signature not Found
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.signatureNotFound,
          },
        });
      } else if (resp.error_code === 400051) {
        // NOTE: attachment upload
        if (resp.attachment_upload_info) {
          yield put({ type: signActions.POST_ATTACHMENTS_UPLOAD_START });
          yield call(uploadAttachmentAll, {
            code: isFastSigning ? code : null,
            attachments,
            info: resp.attachment_upload_info,
            nextAction: putSignTask,
            dataNextAction: {
              payload: {
                ...toPass,
                isAttaUploaded: true,
              },
            },
          });
        }
      } else {
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.signFail,
          },
        });
      }
    } else {
      const pathname = Router.pathname;
      const isWorking =
        pathname.indexOf("/task") === -1 && pathname.indexOf("/tasks") !== -1;
      // NOTE: for tasks page with login
      if (isWorking) {
        const { payload } = yield race({
          timeout: delay(20000),
        });
        if (!payload) {
          const respTask = yield call(
            signApi.getSignTask,
            envelope_id
              ? { envelopeId: resp.data.envelope_id }
              : { taskId: resp.data.task_id },
          );
          if (respTask.data.status !== PDF_TASK_STATUS.completed) {
            yield call(putSignFailed);
            return null;
          }
        }
      }

      // NOTE: proceed for quickSign page
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({ type: signActions.PUT_SIGN_TASK_SUC });
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          taskBlocks: [],

          isFastSigning: isFastSigning,
          isFastSigningDone: isFastSigning,

          isSigningDone: true,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: {
          coverType: reviewResults
            ? PDF_TASK_WARNING.modifySucc
            : isFastSigning
            ? PDF_TASK_WARNING.guestSignSucc
            : PDF_TASK_WARNING.signSucc,
        },
      });
    }
  } catch (err) {
    console.log(err);
    yield call(putSignFailed);
  }
}

function* uploadAttachmentAllPF({
  attachments,
  info,
  nextAction,
  dataNextAction,
}) {
  const inQueue = attachments.filter((atta) => atta.file && !atta.isUploaded);

  if (!inQueue.length) {
    yield call(nextAction, dataNextAction);
    return null;
  }

  const uploadCodes = inQueue.map(
    (el) => info[el.attachment_id]?.split("upload/")[1] || "",
  );

  if (uploadCodes.length) {
    yield all(
      uploadCodes.map((code) =>
        put({
          type: socketActions.INITIALIZE_WEB_SOCKETS_CHANNEL,
          payload: {
            channelType: SOCKET_CHANNEL_TYPE_SIGN,
            code,
          },
        }),
      ),
    );

    const channelStatus = yield call(watchUploadChannelSuccess, {
      uploadCodes,
    });

    if (channelStatus === "fail") {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonFormatError,
      });
      return null;
    }
  }

  for (const atta of inQueue) {
    if (!atta.file) {
      continue;
    }

    const param = {
      file: atta.file,
      info: info[atta.attachment_id],
    };

    const res = yield call(uploadFileSagaPF, param);
    if (!res) {
      return null;
    }
  }

  if (uploadCodes.length) {
    const fileStatus = yield call(watchFileUpload, {
      attachments: inQueue.map((atta) => atta.attachment_id),
    });

    if (fileStatus === "fail") {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonFormatError,
      });
      return null;
    }
    // NOTE: close upload socket so subsequent flows (e.g. ChtVerify modal) can open their own socket
    yield put({ type: socketActions.CLOSE_SOCKET });
  }

  yield call(nextAction, dataNextAction);
  return null;
}

function* uploadFileSagaPF({ file, info }) {
  if (!info || !file) {
    return false;
  }

  const uploadUrl =
    typeof info === "string" ? info : info?.upload_url || info?.url;
  const uploadFields =
    typeof info === "object" ? info?.upload_fields || info?.fields : null;

  if (!uploadUrl) {
    return false;
  }

  const formData = new FormData();
  if (uploadFields && typeof uploadFields === "object") {
    Object.keys(uploadFields).forEach((key) => {
      formData.append(key, uploadFields[key]);
    });
  }
  formData.append("file", file);

  try {
    const response = yield call(() =>
      fetch(uploadUrl, {
        method: "POST",
        body: formData,
      }),
    );

    if (!response || !response.ok) {
      throw new Error("upload failed");
    }

    return true;
  } catch (error) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonFormatError,
    });
    return false;
  }
}

function* uploadAttachmentAll({
  code,
  attachments,
  info,
  nextAction,
  dataNextAction,
}) {
  const inQueue = attachments.filter((atta) => atta.file && !atta.isUploaded);
  const uploadCodes = inQueue.map(
    (el) => info[el.attachment_id]?.split("upload/")[1] || "",
  );

  yield all(
    uploadCodes.map((code) =>
      put({
        type: socketActions.INITIALIZE_WEB_SOCKETS_CHANNEL,
        payload: {
          channelType: SOCKET_CHANNEL_TYPE_SIGN,
          code,
        },
      }),
    ),
  );

  const promises = inQueue.map((el, i) => {
    if (inQueue[i].file) {
      let param = {
        file: inQueue[i].file,
        info: info[inQueue[i].attachment_id],
      };
      if (code) {
        param.code = code;
      }

      let formData = new FormData();
      formData.append("file", inQueue[i].file);

      return call(() =>
        fetch(info[inQueue[i].attachment_id], {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }),
      );
    }
  });

  const channelStatus = yield call(watchUploadChannelSuccess, { uploadCodes });

  if (channelStatus === "fail") {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonFormatError,
    });
    return null;
  }

  yield all(promises);

  const fileStatus = yield call(watchFileUpload, {
    attachments: inQueue.map((atta) => atta.attachment_id),
  });

  if (fileStatus === "fail") {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonFormatError,
    });
    return null;
  }
  // NOTE: close upload socket so subsequent flows (e.g. ChtVerify modal) can open their own socket
  if (uploadCodes.length) {
    yield put({ type: socketActions.CLOSE_SOCKET });
  }
  yield call(nextAction, dataNextAction);
  return null;
}

function* watchUploadChannelSuccess({ uploadCodes }) {
  const completeChan = yield actionChannel(
    socketActions.UPDATE_UPLOAD_CHANNEL_STATUS_SUC,
  );
  let channelSuccess = [];
  let status;

  while (status !== "success" || status !== "fail") {
    const [result, timeout] = yield race([take(completeChan), delay(300000)]);

    if (timeout) {
      return (status = "fail");
    }

    const { code } = result.payload;

    channelSuccess.push(code);

    const isAllSuccess = uploadCodes.every((code) =>
      channelSuccess.includes(code),
    );
    if (isAllSuccess) {
      return (status = "success");
    }
  }
}

function* watchFileUpload(data) {
  const { attachments } = data;
  let status;

  while (status !== "success" || status !== "fail") {
    const [, timeout] = yield race([take("*"), delay(300000)]);
    const { completedAttachments, failedAttachments } = yield select(
      (state) => state.socket,
    );

    if (timeout || failedAttachments.length > 0) {
      yield put({ type: socketActions.FILE_UPLOAD_RESET });
      return (status = "fail");
    }

    const isComplete = attachments.every((attr) =>
      completedAttachments.includes(attr),
    );

    if (isComplete) {
      yield put({ type: socketActions.FILE_UPLOAD_RESET });
      return (status = "success");
    }
  }

  return status;
}

function* putSignFailed() {
  yield put({ type: commonActions.CLOSE_MODAL });
  yield put({ type: signActions.PUT_SIGN_TASK_FAL });
  yield put({
    type: commonActions.OPEN_COVER,
    payload: {
      coverType: PDF_TASK_WARNING.signFail,
    },
  });
}

function* deleteSignTask({ data }) {
  try {
    const resp = yield call(signApi.deleteSignTask, data);

    if (resp.error_code) {
      yield put({ type: signActions.DELETE_SIGN_TASK_FAL });

      if (resp.error_code === 4028) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.taskDeleteProhibited,
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.taskDeleteFal,
        });
      }
    } else {
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: signActions.DELETE_SIGN_TASK_SUC,
        payload: { isSigningDone: true },
      });
      yield put({ type: signActions.GET_TASKS });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.taskDeleteSuc,
      });

      const pathname = Router.pathname;
      const isTask = pathname === "/task";
      if (isTask) {
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.taskDeleted,
          },
        });
        return;
      }
    }
  } catch (error) {
    yield put({ type: signActions.DELETE_SIGN_TASK_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.taskDeleteFal,
    });
  }
}

function* stampPreprocessing(toTransfer) {
  if (toTransfer.category !== "stamp") {
    return null;
  }
  const { raw, file_type } = toTransfer;
  const src = `data:image/${typeToBase64Type(file_type)};base64,${raw}`;

  if (toTransfer.isAgree) {
    yield put({
      type: commonActions.OPEN_MODAL,
      payload: {
        modalType: MODAL_TYPE.backgroundRemovalConfirm,
        modalData: {
          onSubmit: (dispatch) => {
            dispatch({
              type: commonActions.OPEN_MODAL,
              payload: {
                modalType: MODAL_TYPE.imageProcessing,
                modalData: {
                  src,
                  onSubmit: (data) => {
                    dispatch({
                      type: signActions.IMAGE_PROCESSING_SUC,
                      data: {
                        category: "stamp",
                        raw: data.split("data:image/png;base64,")[1],
                        file_type: "png",
                      },
                    });
                  },
                  onCancel: () => {
                    dispatch({
                      type: signActions.IMAGE_PROCESSING_CANCEL,
                    });
                  },
                },
              },
            });
          },
          onCancel: (dispatch) => {
            dispatch({
              type: signActions.IMAGE_PROCESSING_SUC,
              data: null,
            });
          },
        },
      },
    });
  } else {
    yield put({
      type: commonActions.OPEN_MODAL,
      payload: {
        modalType: MODAL_TYPE.consent,
        modalData: {
          confirmData: openModalAction({
            modalType: MODAL_TYPE.backgroundRemovalConfirm,
            modalData: {
              onSubmit: (dispatch) => {
                dispatch({
                  type: commonActions.OPEN_MODAL,
                  payload: {
                    modalType: MODAL_TYPE.imageProcessing,
                    modalData: {
                      src,
                      onSubmit: (data) => {
                        dispatch({
                          type: signActions.IMAGE_PROCESSING_SUC,
                          data: {
                            category: "stamp",
                            raw: data.split("data:image/png;base64,")[1],
                            file_type: "png",
                          },
                        });
                      },
                      onCancel: () => {
                        dispatch({
                          type: signActions.IMAGE_PROCESSING_CANCEL,
                        });
                      },
                    },
                  },
                });
              },
              onCancel: (dispatch) => {
                dispatch({
                  type: signActions.IMAGE_PROCESSING_SUC,
                  data: null,
                });
              },
            },
          }),
        },
      },
    });
  }
}

function* createStampSign() {
  yield put({
    type: commonActions.OPEN_MODAL,
    payload: {
      modalType: MODAL_TYPE.stampCreator,
      modalData: {
        onSubmit: (dataUrl, dispatch) => {
          const raw = dataUrl.split("data:image/png;base64,")[1];
          const binaryData = atob(raw);
          const size = binaryData.length;
          dispatch({
            type: signActions.CREATE_SIGN,
          });
          dispatch({
            type: signActions.SAVE_SIGN,
            data: {
              file_type: "png",
              raw,
              file: {
                size,
              },
              category: "stamp",
            },
          });
        },
      },
    },
  });
}

function* saveSign(action) {
  try {
    const { data } = action;
    const { file, base64_images, license, signId, callback, ...res } = data;
    let toTransfer = { ...res };

    if (license && base64_images) {
      const resp = yield call(convertImagesToVideo, {
        base64_images,
      });
      if (resp.data) {
        toTransfer = { ...toTransfer, sign_video: resp.data };
      }
    }
    // NOTE: limit stamp size
    if (data.category === SIGNATURE_CATEGORY.STAMP && file.size > 10000000) {
      yield put({ type: signActions.SAVE_SIGN_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.signOversize,
      });
      return null;
    }

    if (data.category === SIGNATURE_CATEGORY.STAMP) {
      yield call(stampPreprocessing, toTransfer);

      const response = yield take(
        (action) =>
          action.type === signActions.IMAGE_PROCESSING_SUC ||
          action.type === signActions.IMAGE_PROCESSING_CANCEL,
      );
      if (response.type === signActions.IMAGE_PROCESSING_CANCEL) {
        return yield call(saveSign, {
          ...action,
          data: { ...action.data, isAgree: true },
        });
      }
      const { data: data2 } = response;
      toTransfer = data2 || toTransfer;
    }

    const { code } = yield select((state) => state.sign);
    if (code) {
      toTransfer.code = code;
    }
    const resp = yield call(signApi.saveSign, toTransfer);

    if (resp.error_code) {
      throw resp.error_code;
    }

    if (data.category === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO && callback) {
      const { photoSignatures } = yield select((state) => state.sign);
      const { user } = yield select((state) => state.auth);

      const updatedPhotoSignatures = updatePhotoSignatures({
        photoSignatures,
        url: `data:image/png;base64,${data.sign_photo}`,
        id: signId,
        email: user.email,
      });

      yield put({
        type: signActions.SET_PHOTO_SIGNATURES,
        payload: updatedPhotoSignatures,
      });

      callback(resp.data);
    }

    yield put({ type: signActions.SAVE_SIGN_SUC, payload: resp.data });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.signSaveSuc,
      toastId:
        data.category === SIGNATURE_CATEGORY.STAMP ? "Stamp-uplod-suces" : null,
    });

    const dataSet = {
      category:
        data.category === SIGNATURE_CATEGORY.STAMP
          ? SIGNATURE_CATEGORY.STAMP
          : SIGNATURE_CATEGORY.SIGNATURE,
    };
    yield put({
      type: signActions.GET_SIGNS,
      data: dataSet,
    });
  } catch (errorCode) {
    console.log(errorCode);
    const errorToast = {
      4001312: toastStatus.signSaveAlreadyExist,
    };
    yield put({ type: signActions.SAVE_SIGN_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: errorToast[errorCode] || toastStatus.signSaveFal,
    });
    yield call(getSignatures);
    return false;
  }
}

function* saveSignGuest({ data }) {
  try {
    let { code } = yield select((state) => state.sign);
    const { taskUuid, photoSignatures } = yield select((state) => state.sign);
    const { form_token } = yield select((state) => state.publicForm);

    if (data.code) {
      code = data.code;
    }

    const {
      raw: { raw, base64_images },
      license,
      signId,
      callback,
      ...res
    } = data;
    let toTransfer = { ...res, raw };
    if (license && base64_images) {
      const resp = yield call(convertImagesToVideo, {
        base64_images,
        code,
        ...(form_token ? { form_token } : {}),
      });
      if (resp.data) {
        toTransfer = {
          ...toTransfer,
          sign_video: resp.data,
        };
      }
    }

    if (code) {
      toTransfer.code = code;
    }
    if (taskUuid) {
      toTransfer.work_id = taskUuid;
    }
    if (form_token) {
      toTransfer.form_token = form_token;
    }
    const resp = yield call(signApi.saveSignGuest, toTransfer);

    if (resp.error_code) {
      yield put({ type: signActions.SAVE_SIGN_GUEST_FAL });

      if (resp.error_code === 400049) {
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.duplicateWorkingState,
          },
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.commonError,
        });
      }
    } else {
      if (
        data.category === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO &&
        callback
      ) {
        const { email } = yield select((state) => state.auth.user);

        const updatedPhotoSignatures = updatePhotoSignatures({
          photoSignatures,
          url: `data:image/png;base64,${data.sign_photo}`,
          id: signId,
          email,
        });

        yield put({
          type: signActions.SET_PHOTO_SIGNATURES,
          payload: updatedPhotoSignatures,
        });

        callback(resp.data);
      }

      yield put({
        type: signActions.SAVE_SIGN_GUEST_SUC,
        payload: {
          guestSignature: resp.data,
        },
      });
    }
  } catch (err) {
    yield put({ type: signActions.SAVE_SIGN_GUEST_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* deleteSign({ payload }) {
  try {
    const { id } = payload;
    const res = yield call(signApi.deleteSign, id);
    const { data } = res;

    if (res.error_code && res.error_message) {
      yield put({ type: signActions.DELETE_SIGN_FAL });
      const errorToast = {
        404030: toastStatus.signDeleteAlreadyDelete,
      };
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: errorToast[res.error_code] || toastStatus.signDeleteFal,
      });
      yield call(getSignatures);
    } else {
      yield put({ type: signActions.DELETE_SIGN_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.signDeleteSuc,
      });
      const dataSet = {
        category: data.category === "stamp" ? "stamp" : "signature",
      };
      yield put({
        type: signActions.GET_SIGNS,
        data: dataSet,
      });

      const getAppliedSigns = (state) => state.sign.appliedSigns;
      const appliedSigns = yield select(getAppliedSigns);

      if (appliedSigns) {
        const filteredAppliedSigns = appliedSigns.filter(
          (sign) => sign.obj && sign.obj.id !== id,
        );
        yield put({
          type: signActions.UPDATE_APPLIED_SIGNS_SUC,
          payload: filteredAppliedSigns,
        });
      }

      yield put({ type: createActions.DELETE_STAGE, id });
    }
  } catch (error) {
    yield put({ type: signActions.DELETE_SIGN_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.signDeleteFal,
    });
  }
}

function* getEmailOut({ task_id }) {
  try {
    const resp = yield call(signApi.getEmailOut, task_id);

    if (resp.error) {
      yield put({ type: signActions.GET_EMAIL_OUT_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.getEmailOutFal,
      });
    } else {
      yield put({ type: signActions.GET_EMAIL_OUT_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.getEmailOutSuc,
      });
    }
  } catch (error) {
    yield put({ type: signActions.GET_EMAIL_OUT_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.getEmailOutFal,
    });
  }
}

function* getDownloadFile({ data }) {
  try {
    yield put({ type: signActions.GET_TASK_FILE, data });
  } catch (err) {
    console.log(err);
  }
}

function* getAuditTrail({ data }) {
  try {
    const res = yield call(signApi.getAuditTrail, data);

    if (res.error_code && res.error_message) {
      if (res.error_code === 403036) {
        yield put({
          type: commonActions.OPEN_TOAST,
          data: { isWarning: true, text: "task_not_accessible" },
        });
      }
      yield put({ type: signActions.GET_AUDIT_TRAIL_FAL });
    }
  } catch (error) {
    yield put({ type: signActions.GET_AUDIT_TRAIL_FAL });
  }
}

function* getTaskFile({ data }) {
  try {
    const { isMobile, filename, envelopeName } = data;
    const getSign = (state) => state.sign;
    const { taskUuid, task_id, envelope_id, code } = yield select(getSign);

    const res = yield call(signApi.getTaskFile, {
      isMobile,
      work_id: taskUuid,
      envelope_id: envelope_id || data.envelopeId,
      task_id: task_id || data.taskId,
      filename,
      envelopeName,
      code,
    });

    if (res.error_code && res.error_message) {
      if (res.error_code === 403036) {
        yield put({
          type: commonActions.OPEN_TOAST,
          data: { isWarning: true, text: "task_not_accessible" },
        });
      }
      yield put({ type: signActions.GET_TASK_FILE_FAL });
    }
  } catch (error) {
    yield put({ type: signActions.GET_TASK_FILE_FAL });
  }
}

function* getAuditTrailHistory({ data }) {
  try {
    const res = yield call(signApi.getAuditTrailHistory, data);

    if (res.error_code && res.error_message) {
      yield put({ type: signActions.GET_AUDIT_TRAIL_HISTORY_FAL });
    } else {
      yield put({
        type: signActions.GET_AUDIT_TRAIL_HISTORY_SUC,
        payload: res.data,
      });
    }
  } catch (error) {
    yield put({ type: signActions.GET_AUDIT_TRAIL_HISTORY_FAL });
  }
}

function* updateAppliedSigns({ data }) {
  try {
    const { taskBlocks, appliedSigns } = yield select((state) => state.sign);

    const { stageid, blockid, taskId, options, signObj } = data;

    if (!signObj) {
      return;
    }

    const isRadio = signObj.category === "checkbox" && signObj.style === 1;
    const blockFocus = (() => {
      const stgFocus = taskBlocks.find((stg) => stg.stageId === stageid);
      if (typeof stgFocus === "undefined") {
        return null;
      }

      const blkFocus = stgFocus.blocks.find((blk) => blk.id === blockid);
      if (typeof blkFocus === "undefined") {
        return null;
      }

      return {
        stageid,
        blockid,
        field_group_object_id: blkFocus.field_group_object_id,
        changed: true,
        ...(taskId ? { taskId } : {}),
      };
    })();

    if (!blockFocus) {
      yield put({ type: signActions.UPDATE_APPLIED_SIGNS_FAL });
      return;
    }

    const blockRes = appliedSigns.filter((sign) => sign.blockid !== blockid);
    let signArr = [];

    const signInfo = {
      ...blockFocus,
      obj: signObj,
      options,
    };

    const groupId = blockFocus.field_group_object_id;
    const isGroup = typeof groupId !== "undefined" && groupId !== null;

    if (isGroup && isRadio) {
      const val = signObj.raw;

      const blockResUpdated = (() => {
        if (!val) {
          return [...blockRes];
        }

        return blockRes.map((block) => {
          const isPrevChecked = block.obj.raw;
          if (block.field_group_object_id === groupId) {
            return {
              ...block,
              ...(isPrevChecked ? { changed: true } : {}),
              obj: {
                ...block.obj,
                raw: false,
              },
            };
          }

          return block;
        });
      })();

      signArr = [...blockResUpdated, signInfo];
    } else {
      signArr = [...blockRes, signInfo];
    }

    yield put({ type: signActions.UPDATE_APPLIED_SIGNS_SUC, payload: signArr });
  } catch (error) {
    yield put({ type: signActions.UPDATE_APPLIED_SIGNS_FAL });
  }
}

function* getOverall() {
  yield put({ type: signActions.GET_TASKS });
}

function* getTasks({ payload }) {
  try {
    const getTasksParams = (state) => state.sign;
    const { filter, focus, focusPage } = yield select(getTasksParams);
    const category = payload && payload.category ? payload.category : focus;

    const payloadManified = {
      category,
      page: payload && payload.page ? payload.page : focusPage,
      per_page: TASKS_PER_PAGE,
    };

    const isExpiredFilter =
      filter && ["waiting_for_me", "waiting_for_others"].includes(category);
    if (isExpiredFilter) {
      payloadManified.filter = filter;
    }

    const res = isExpiredFilter
      ? yield call(signApi.getFilterTasks, payloadManified)
      : yield call(signApi.getTasks, payloadManified);

    if (!res.data) {
      return yield put({ type: signActions.GET_TASKS_FAL });
    }

    const {
      waiting_for_me_expire_soon,
      waiting_for_others_expire_soon,
      ...resSummary
    } = res.data.taskSummary;
    const expiredSummary = {
      ...resSummary,
      waiting_for_me: waiting_for_me_expire_soon,
      waiting_for_others: waiting_for_others_expire_soon,
    };
    const taskSummary = filter ? expiredSummary : res.data.taskSummary;

    yield put({
      type: signActions.GET_TASKS_SUC,
      payload: { ...res.data, taskSummary },
    });
  } catch (err) {
    yield put({ type: signActions.GET_TASKS_FAL });
  }
}

function* getPublicFormTasks({ payload }) {
  try {
    const getTasksParams = (state) => state.sign;
    const { focus, focusPage } = yield select(getTasksParams);
    const getPublicFormParams = (state) => state.publicForm;
    const {
      publicFormPerPage,
      publicFormSearchTerm,
      publicFormCurrentPage,
      tabActive,
    } = yield select(getPublicFormParams);
    const defaultPerPage = PUBLIC_FORM_PER_PAGE;
    const category =
      payload?.category ??
      (tabActive && tabActive !== "my_public_forms" ? tabActive : undefined) ??
      focus;

    const payloadManified = {
      category,
      page: payload?.page ?? publicFormCurrentPage ?? focusPage,
      per_page: payload?.perPage ?? publicFormPerPage ?? defaultPerPage,
      terms: payload?.terms ?? publicFormSearchTerm ?? undefined,
    };

    const res = yield call(signApi.getPublicFormTasks, payloadManified);

    if (!res.data) {
      return yield put({ type: signActions.GET_TASKS_FAL });
    }

    const taskSummary = res.data.taskSummary;

    yield put({
      type: signActions.GET_TASKS_SUC,
      payload: { ...res.data, taskSummary },
    });

    yield put({
      type: publicFormActions.UPDATE_PUBLIC_FORM_CONDITION,
      payload: {
        ...payloadManified,
        category:
          tabActive === "my_public_forms" ? "my_public_forms" : category,
      },
    });
  } catch (err) {
    yield put({ type: signActions.GET_TASKS_FAL });
  }
}

function* putFileName({ data }) {
  try {
    const resp = yield call(signApi.putFileName, data);

    if (resp.error_code) {
      yield put({ type: signActions.PUT_FILE_NAME_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putFileNameFal,
      });
    } else {
      yield put({ type: signActions.PUT_FILE_NAME_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putFileNameSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
    }
  } catch (err) {
    yield put({ type: signActions.PUT_FILE_NAME_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putFileNameFal,
    });
  }
}

function* postSetup({ data }) {
  try {
    const resp = yield call(signApi.postSetup, data);

    if (resp.error_code) {
      yield put({ type: signActions.POST_SETUP_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postSetupFal,
      });
    } else {
      yield put({ type: signActions.POST_SETUP_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postSetupSuc,
      });
    }
  } catch (err) {
    yield put({ type: signActions.POST_SETUP_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postSetupFal,
    });
  }
}

function* postOtpResend({ data }) {
  try {
    let toPass = { ...data };
    const { code } = yield select((state) => state.sign);
    const getTaskUuid = (state) => state.sign.taskUuid;
    const taskUuid = yield select(getTaskUuid);
    const { form_token } = yield select((state) => state.publicForm);
    if (code) {
      toPass.code = code;
    }
    if (taskUuid) {
      toPass.work_id = taskUuid;
    }
    if (form_token) {
      toPass.form_token = form_token;
    }

    const resp = yield call(signApi.postOtpResend, toPass);

    if (resp.error_code) {
      if (resp.error_code === 400049) {
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.duplicateWorkingState,
          },
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.otpResendFal,
        });
      }
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.otpResendSuc,
      });
    }
  } catch (err) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.otpResendFal,
    });
  }
}

function* postFastSigningConsent({ data }) {
  try {
    const { isChecked } = data;
    const getTaskUuid = (state) => state.sign.taskUuid;
    const { code } = yield select((state) => state.sign);
    const taskUuid = yield select(getTaskUuid);

    let toPass = { check: isChecked };
    if (code) {
      toPass.code = code;
    }
    if (taskUuid) {
      toPass.work_id = taskUuid;
    }
    const resp = yield call(signApi.postFastSigningConsent, toPass);

    if (isChecked) {
      if (resp.error_code) {
        if (resp.error_code === 403048) {
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: PDF_TASK_WARNING.beenDeclined,
            },
          });
        } else if (resp.error_code === 403040) {
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: PDF_TASK_WARNING.beenForwarded,
            },
          });
        } else if (resp.error_code === 403055) {
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: PDF_TASK_WARNING.taskExpired,
            },
          });
        } else {
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.commonError,
          });
        }
        yield put({ type: signActions.POST_FAST_SIGNING_CONSENT_FAL });
        return false;
      } else {
        // NOTE: Wait for Redis in the backend to write user data for later read API.
        yield delay(500);

        yield put({ type: signActions.POST_FAST_SIGNING_CONSENT_SUC });
        yield put({
          type: signActions.GET_SIGN_TASK,
          data: { isFastSigning: true },
        });
      }
    }
  } catch (err) {
    yield put({ type: signActions.POST_FAST_SIGNING_CONSENT_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
    return false;
  }
}

function* postInviteSignResend({ data }) {
  try {
    const { ...res } = data;
    const resp = yield call(signApi.postInviteSignResend, res);

    if (resp.error_code) {
      if (resp.error_code === 404032) {
        // NOTE: stage not found
        yield put({ type: signActions.POST_INVITE_SIGN_RESEND_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postInviteSignResendFal,
        });
      } else if (resp.error_code === 403030) {
        // NOTE: not owner
        yield put({ type: signActions.POST_INVITE_SIGN_RESEND_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postInviteSignResendFal,
        });
      } else if (resp.error_code === 406030) {
        // NOTE: email been bounced
        yield put({ type: signActions.POST_INVITE_SIGN_RESEND_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postInviteSignResendFalEmailBounced,
        });
      }
    } else {
      yield put({ type: signActions.POST_INVITE_SIGN_RESEND_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postInviteSignResendSuc,
      });
    }
  } catch (err) {
    yield put({ type: signActions.POST_INVITE_SIGN_RESEND_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* postNotifySender({ data }) {
  try {
    const { message, code, taskId, envelopeId } = data;

    yield put({ type: signActions.POST_NOTIFY_SENDER_BEGIN });
    const resp = yield call(signApi.postNotifySender, {
      message,
      ...(envelopeId ? { envelope_id: envelopeId } : { sign_task_id: taskId }),
      code,
    });
    if (resp.data) {
      yield put({ type: signActions.POST_NOTIFY_SENDER_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postNotifySenderSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
    } else {
      yield put({ type: signActions.POST_NOTIFY_SENDER_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postNotifySenderFal,
      });
    }
  } catch (err) {
    yield put({ type: signActions.POST_NOTIFY_SENDER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* postChangeOwner({ data }) {
  try {
    const { taskId, envelopeId, email } = data;

    const resp = yield call(signApi.postChangeOwner, {
      taskId,
      envelopeId,
      email,
    });

    if (resp.data) {
      yield put({ type: signActions.POST_CHANGE_OWNER_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postChangeOwnerSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({ type: signActions.GET_TASKS });
      yield call(Router.push, "/tasks");
    } else {
      yield put({ type: signActions.POST_CHANGE_OWNER_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postChangeOwnerFal,
      });
    }
  } catch (err) {
    yield put({ type: signActions.POST_CHANGE_OWNER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putChangeSigner({ data }) {
  try {
    const getSign = (state) => state.sign;
    const sign = yield select(getSign);
    const { isFastSigning, code } = sign;

    const { verify_methods, ...toTransfer } = data;
    let isUsingSystemCA = false;

    if (verify_methods) {
      isUsingSystemCA = verify_methods[0]?.verify_type === "cht_system";
    }

    // NOTE: check if changing signer has matching system CA
    if (isUsingSystemCA) {
      const response = yield call(createApi.getAssigneeSystemCAList, {
        email: data.new_signer.email,
      });
      const assigneeSystemCAList = response.data;
      const isMatchingSource = assigneeSystemCAList.some(
        (item) => item.id === Number(verify_methods[0].verify_source),
      );

      if (!isMatchingSource) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.unmatchedSystemCA,
        });
        return;
      }
    }

    const resp = isFastSigning
      ? yield call(signApi.putChangeSigner, { ...toTransfer, code })
      : yield call(signApi.putChangeSigner, toTransfer);

    if (resp.error_code) {
      yield put({ type: signActions.POST_CHANGE_SIGNER_FAL });

      if (resp.error_code === 400050) {
        // NOTE: non-order, duplicate signer
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.duplicatedSigner,
        });
      } else if (resp.error_code === 400035) {
        // NOTE: task not in-process
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.invalidTask,
        });
      } else if (resp.error_code === 400046) {
        // NOTE: stage already done
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.stageAlreadyDone,
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putChangeSignerFal,
        });
      }
    } else {
      yield put({ type: signActions.POST_CHANGE_SIGNER_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putChangeSignerSuc,
      });

      yield delay(4000);
      yield put({ type: commonActions.CLOSE_MODAL });

      if (isFastSigning) {
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.beenForwarded,
          },
        });
      } else if (Router.pathname.includes("/tasks")) {
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
      } else {
        yield call(Router.push, "/tasks");
      }
    }
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.POST_CHANGE_SIGNER_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* resetSign() {
  try {
    yield put({ type: RESET_PREVIEW });
    yield put({ type: RESET_PDF });
  } catch (err) {
    console.log(err);
  }
}

function* changeFileName({ data }) {
  try {
    const res = yield call(signApi.changeFileName, data);
    if (res.error_code) {
      yield put({ type: signActions.PUT_FILE_NAME_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putFileNameFal,
      });
    } else {
      yield put({ type: signActions.PUT_FILE_NAME_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putFileNameSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({ type: signActions.GET_OVERALL });
    }
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.PUT_FILE_NAME_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putFileNameFal,
    });
  }
}

function* declineToSign({ data }) {
  try {
    const getTaskUuid = (state) => state.sign.taskUuid;
    const taskUuid = yield select(getTaskUuid);
    const response = yield call(signApi.declineToSign, {
      ...data,
      work_id: taskUuid,
    });
    if (response.error_code) {
      yield put({ type: signActions.POST_DECLINE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.declineToSignFal,
      });
    } else {
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({ type: signActions.POST_DECLINE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.declineToSignSuc,
      });
      yield take(commonActions.CLOSE_TOAST);

      const getIsFastSigning = (state) => state.sign.isFastSigning;
      const isFastSigning = yield select(getIsFastSigning);
      if (isFastSigning) {
        yield put({
          type: commonActions.OPEN_COVER,
          payload: {
            coverType: PDF_TASK_WARNING.beenDeclined,
          },
        });
        return;
      } else {
        yield call(Router.push, "/tasks");
      }
    }
  } catch (error) {
    yield put({ type: signActions.POST_DECLINE_FAL, error });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* postKioskVerify({ data }) {
  const { task_name, task_description, ...dataRes } = data;
  const myBackup = { ...data };

  try {
    const resp = yield call(signApi.postKioskVerify, dataRes);

    if (resp.error_code) {
      yield put({ type: signActions.POST_KIOSK_VERIFY_FAL });

      switch (resp.error_code) {
        case 400201:
          // NOTE: invalid email domain
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.emailDomainError,
          });
          break;

        case 400901:
          // NOTE: need signer info
          yield put({ type: commonActions.CLOSE_MODAL });

          yield put({
            type: commonActions.OPEN_MODAL,
            payload: {
              modalType: MODAL_TYPE.consent,
              modalData: {
                confirmData: openModalAction({
                  modalType: MODAL_TYPE.kioskSignerInfo,
                  modalData: {
                    sign_task_id: myBackup.sign_task_id,
                    signer_requisite: resp.signer_requisite,
                    signer_role: resp.signer_role,
                    task_name: task_name || resp.task_name,
                    task_description: task_description || resp.task_description,
                  },
                }),
              },
            },
          });
          break;

        case 400048:
          // NOTE: make sure been executed on the same machine
          yield put({ type: commonActions.CLOSE_MODAL });
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: EMBEDDED_STATUS.kioskInvalidClient,
            },
          });
          break;

        case 406031:
          // NOTE: invalid otp
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.invalidOtp,
          });
          break;

        case 406032:
          // NOTE: target unable to receive otp
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.kioskOtpFailed,
          });
          break;

        case 400904:
          // NOTE: timeout
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: EMBEDDED_STATUS.timeout,
            },
          });
          break;

        case 400220:
          // NOTE: email format error
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.emailFormatError,
          });
          break;

        default:
          console.log(`exception error ${resp.error_code}`);
          yield put({ type: commonActions.CLOSE_MODAL });
          yield put({
            type: commonActions.OPEN_COVER,
            payload: {
              coverType: EMBEDDED_STATUS.commonError,
            },
          });
          break;
      }

      return;
    }

    yield put({ type: commonActions.CLOSE_MODAL });

    // NOTE: update auth
    yield put({
      type: authActions.SET_USER,
      payload: { isFake: true },
    });

    const getTask = (state) => state.sign;
    const { download_link: fileUrl } = yield select(getTask);
    const getPdfInfo = (state) => state.pdf;
    const { viewport, pdfRotates, isRenderDone } = yield select(getPdfInfo);

    let vp = viewport;
    let rotates = pdfRotates;

    if (!isRenderDone) {
      const doc = yield call(getDoc, fileUrl);

      if (!doc) {
        yield put({ type: signActions.POST_KIOSK_VERIFY_FAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: EMBEDDED_STATUS.unableFetchTemplate },
        });
        return;
      }

      const vpData = yield call(getAllViewport, doc);
      if (!vpData) {
        yield put({ type: signActions.POST_KIOSK_VERIFY_FAL });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: EMBEDDED_STATUS.unableFetchTemplate },
        });
        return;
      }

      vp = vpData.viewport;
      rotates = vpData.rotates;
    }

    const { task_id, current_stage_ids, stage_infos, navbar } = resp.data;

    let taskBlocks = [];
    let attachments;
    let blkWithDefault = [];

    stage_infos.map((task, idx) => {
      const {
        attachment_setting,
        field_settings,
        xfdf_text,
        field_setting_groups,
      } = task.full_info;
      if (!xfdf_text) {
        return null;
      }

      const isMyTurn = task.action_type === PDF_TASK_PERSONAL_STATUS.processing;

      // NOTE: attachments
      if (isMyTurn) {
        if (attachment_setting) {
          attachments = attachment_setting.map((atta) => {
            return {
              ...atta,
              stage_id: task.stage_id,
            };
          });
        }
      }

      let blocks = xfdf2Obj(
        xfdf_text,
        task.action_type,
        current_stage_ids[0] === task.stage_id,
      );

      let stageBlocks = [];
      blocks.forEach((blk) => {
        const { img: blkImg, ...restBlk } = blk;
        void blkImg; // NOTE: unused variable

        // NOTE: options
        let blkOption = {};
        let setting;

        if (field_settings) {
          setting = field_settings.find(
            (itm) => itm.field_object_id === blk.id,
          );
        }

        const group = field_setting_groups.find(
          (g) => g.field_group_object_id === setting?.field_group_object_id,
        );

        if (
          (setting !== undefined &&
            setting.options &&
            setting.options.force !== undefined) ||
          setting.field_type === fieldTypes.checkbox ||
          setting.field_type === fieldTypes.radio ||
          setting.field_type === fieldTypes.image ||
          setting.field_type === fieldTypes.link
        ) {
          blkOption = {
            options: {
              ...setting.options,
              read_only: group?.options.read_only,
            },
          };
        } else {
          // NOTE: may old ones
          blkOption = { options: { force: true } };
          if (blk.type === "textfield") {
            if (blk.is_date) {
              blkOption.options.date_setting = "current_only";
            } else {
              blkOption.options.is_multi_line = true;
            }
          }
        }

        // NOTE: handle block type, fieldValue, defaultPlaceholder, img
        let fieldType;
        let defaultPlaceholder;

        if (setting?.field_type) {
          if (setting?.field_type === fieldTypes.sign) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_signature";
          } else if (setting?.field_type === fieldTypes.text) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_text";
          } else if (setting?.field_type === fieldTypes.date) {
            fieldType = fieldTypes.text;
            defaultPlaceholder = "input_date";
          } else if (setting?.field_type === fieldTypes.radio) {
            fieldType = fieldTypes.checkbox;
          } else if (setting?.field_type === fieldTypes.image) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_image";
          } else if (setting?.field_type === fieldTypes.link) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_link";
          } else {
            fieldType = setting.field_type;
          }
        }

        stageBlocks.push({
          ...(fieldType === fieldTypes.image ? { ...restBlk } : { ...blk }),
          ...blkOption,
          coord: getMyCoord(blk.coord, vp[blk.page - 1], rotates[blk.page - 1]),
          field_group_object_id: setting?.field_group_object_id,
          type: fieldType,
          ...(defaultPlaceholder ? { defaultText: defaultPlaceholder } : {}),
        });
      });

      // NOTE: task blocks
      taskBlocks.push({
        order: idx,
        stageId: task.stage_id,
        isMyTurn,
        status: task.action_type,
        blocks: stageBlocks,
        changeable: task.changeable,
        fieldGroups: field_setting_groups,
      });

      // NOTE: handle myTurn default value
      if (isMyTurn) {
        stageBlocks.map((field) => {
          let obj;
          let type = field.type;

          // NOTE: determine type
          if (field.type === "textfield" && field.is_date) {
            type = "datefield";
          }
          if (
            (field.type === "checkbox" && field.style === 1) ||
            field.type === "radio"
          ) {
            type = "radio";
          }

          // NOTE: create obj based on type
          switch (type) {
            case "textfield":
              obj = {
                category: "textfield",
                raw: field.options.default || "",
              };
              break;

            case "radio":
              obj = {
                category: "checkbox",
                raw: field.options.default || false,
                style: 1,
              };
              break;

            case "checkbox":
              obj = {
                category: "checkbox",
                raw: field.options.default || false,
                style: 0,
              };
              break;

            case "link":
              obj = {
                category: "link",
                raw: field.options.default || "",
              };
              break;

            case "image":
              obj = {
                category: "image",
                raw: null,
              };
              break;

            default:
              break;
          }

          if (obj) {
            blkWithDefault.push({
              stageid: task.stage_id,
              blockid: field.id,
              options: field.options,
              field_group_object_id: field.field_group_object_id,
              obj,
            });
          }
        });
      }
    });

    const payload = {
      task_id,
      isMyTurn: true,
      has_order: true,
      taskBlocks,
      ccInfos: resp.data.cc_info,
      kiosk_sign_token: resp.data.verify_token,
      navbar,
    };

    // NOTE: optional
    if (attachments) {
      payload.attachments = attachments;
    }

    yield put({
      type: signActions.POST_KIOSK_VERIFY_SUC,
      payload,
    });
    // NOTE: update appliedSigns default
    if (blkWithDefault.length > 0) {
      yield put({
        type: signActions.UPDATE_APPLIED_SIGNS_SUC,
        payload: blkWithDefault,
      });
    }
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.POST_KIOSK_VERIFY_FAL });
    yield put({
      type: commonActions.OPEN_COVER,
      payload: { coverType: EMBEDDED_STATUS.unableFetchTemplate },
    });
  }
}

function* putKioskSign({ data }) {
  try {
    const { task_id, signs, dispatch } = data;
    const getSignInfo = (state) => state.sign;
    const { kiosk_sign_token, attachments } = yield select(getSignInfo);

    let stageSigns = [];
    signs.map((sign) => {
      let type = sign.obj.category;
      let value = sign.obj.raw;

      if (type === SIGNATURE_CATEGORY.SIGNATURE && !value) {
        value = null;
      }
      if (type === "textfield" && sign.is_date && !value) {
        value = null;
      }
      if (type === "textfield" && !sign.is_date && !value) {
        value = "";
      }
      if (type === "checkbox" && !value) {
        value = false;
      }
      if (type === SIGNATURE_CATEGORY.GUEST_SIGNATURE && !value) {
        value = false;
      }
      if (type === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO && !value) {
        value = false;
      }

      const isSignature =
        type === SIGNATURE_CATEGORY.SIGNATURE ||
        type === SIGNATURE_CATEGORY.INITIAL ||
        type === SIGNATURE_CATEGORY.STAMP ||
        type === SIGNATURE_CATEGORY.GUEST_SIGNATURE ||
        type === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO;

      const isImage = sign.obj.category === "image";

      const getStageType = () => {
        if (isSignature) {
          return "guest_signature";
        } else {
          return sign.obj.category;
        }
      };

      const getValue = () => {
        if (isSignature) {
          return sign.obj.id;
        } else if (isImage) {
          return sign.obj.image_id;
        } else {
          return sign.obj.raw;
        }
      };

      let stageTemp = {
        object_id: sign.blockid,
        type: getStageType(),
        value: getValue(),
      };

      const objKey = ["style"];
      objKey.forEach((key) => {
        if (typeof sign.obj[key] !== "undefined") {
          stageTemp[key] = sign.obj[key];
        }
      });

      const optionKey = ["date_format", "zone", "font_size", "alignment"];
      optionKey.forEach((key) => {
        if (typeof sign.options[key] !== "undefined") {
          stageTemp[key] = sign.options[key];
        }
      });

      const shouldSkip = (isSignature || isImage) && !stageTemp.value;

      if (shouldSkip) {
        return;
      }

      stageSigns.push(stageTemp);
    });

    const dataSend = {
      sign_task_id: task_id,
      signature_info: stageSigns,
      verify_info: {
        verify_token: kiosk_sign_token,
      },
    };

    if (attachments) {
      let info_atta = [];
      attachments.map((atta) => {
        if (atta.file) {
          info_atta.push({
            attachment_id: atta.attachment_id,
            attachment_type: getImageFormat(atta.file.type),
          });
        }
      });
      dataSend.attachment_info = info_atta;
    }

    const resp = yield call(signApi.putKioskSign, dataSend);

    if (resp.error_code) {
      // NOTE: attachments
      if (resp.error_code === 400051) {
        yield put({ type: signActions.POST_ATTACHMENTS_UPLOAD_START });

        yield call(uploadAttachmentAll, {
          attachments,
          info: resp.attachment_upload_info,
          nextAction: putKioskSign,
          dataNextAction: { data },
        });

        return;
      }

      yield put({ type: signActions.PUT_KIOSK_SIGN_FAL });

      let coverType;
      switch (resp.error_code) {
        case 400048:
          // NOTE: invalid client
          coverType = EMBEDDED_STATUS.kioskInvalidClient;
          break;
        case 406031:
        case 403034:
          // NOTE: invalid stage
          coverType = EMBEDDED_STATUS.kioskInvalidStage;
          break;
        case 400904:
          // NOTE: timeout
          coverType = EMBEDDED_STATUS.timeout;
          break;
        case 4001003:
          // NOTE: over limit
          coverType = EMBEDDED_STATUS.overLimit;
          break;
        default:
          coverType = EMBEDDED_STATUS.commonError;
          break;
      }

      yield put({ type: signActions.PUT_KIOSK_SIGN_FAL });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType },
      });
      return;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putSignSuc,
    });
    yield delay(5000);

    const idxLast = resp.data.stage_infos.length - 1;
    const statusLast = resp.data.stage_infos[idxLast].action_type;
    if (statusLast === PDF_TASK_PERSONAL_STATUS.done) {
      yield put({ type: signActions.PUT_KIOSK_SIGN_SUC });
      yield put({ type: commonActions.CLOSE_MODAL });

      // NOTE: front desk
      yield put({
        type: authActions.SET_USER,
        payload: { isFake: false },
      });
      yield put({ type: signActions.RESET_SIGN });
      yield call(Router.push, `/task?taskId=${task_id}`);
      return;
    }

    // NOTE: not completed
    yield put({ type: signActions.PUT_KIOSK_SIGN_SUC });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: signActions.POST_KIOSK_VERIFY,
      data: { sign_task_id: task_id, dispatch },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.PUT_KIOSK_SIGN_FAL });
  }
}

function* downloadAttachment({ data }) {
  try {
    const res = yield call(signApi.downloadAttachment, data);

    if (res.error_code && res.error_message) {
      yield put({ type: signActions.DOWNLOAD_ATTACHMENT_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    } else {
      yield put({ type: signActions.DOWNLOAD_ATTACHMENT_SUC });
    }
  } catch (error) {
    yield put({ type: signActions.DOWNLOAD_ATTACHMENT_FAL });
  }
}

function* getGraAuthorizeStatus({ data }) {
  try {
    const res = yield call(signApi.getGraAuthorizeStatus, data);

    if (res.error_code) {
      yield put({ type: signActions.GET_GRA_AUTHORIZE_STATUS_FAL });
    } else {
      yield put({ type: signActions.GET_GRA_AUTHORIZE_STATUS_SUC });

      if (res.data.status === socketEvents.cht_verify_fal) {
        yield put({ type: socketActions.ON_CHT_VERIFY_FAL });
      } else if (res.data.status === socketEvents.cht_verified) {
        yield put({
          type: socketActions.SET_SOCKET_STATUS_COMPLETE,
          payload: "chtVerified",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function* postReissueTask({ data }) {
  try {
    const res = yield call(signApi.postReissueTask, data);
    const { code, sign_task_id } = data;

    if (res.error_code) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postReissueTaskFal,
      });
      yield delay(5000);
      yield call(Router.push, "/tasks");
    } else {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postReissueTaskSuc,
      });
      yield delay(5000);
      if (code) {
        yield call(Router.push, "/task?code=" + code);
      } else {
        yield call(Router.push, "/task?taskId=" + sign_task_id);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function* postDuplicateSignTask({ data }) {
  try {
    const { taskId, envelopeId } = data;
    const reqData = {
      ...(taskId ? { sign_task_id: taskId } : {}),
      ...(envelopeId ? { envelope_id: envelopeId } : {}),
    };
    const res = envelopeId
      ? yield call(signApi.postDuplicateEnvelope, reqData)
      : yield call(signApi.postDuplicateSignTask, reqData);
    if (res.error_code) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postDuplicateSignTaskFal,
      });
    } else {
      const { task_id: taskId, envelope_id: envelopeId } = res.data;
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postDuplicateSignTaskSuc,
      });
      yield delay(5000);
      if (envelopeId) {
        yield call(
          Router.push,
          `/create-envelope/assign-fields?envelopeId=${envelopeId}`,
        );
      } else {
        yield call(Router.push, `/create-task/assign-fields?taskId=${taskId}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function* postSaveAsTemplate({ payload }) {
  try {
    const resp = yield call(signApi.postSaveAsTemplate, payload);
    const { data: responseData, error_code: errorCode } = resp;

    if (errorCode) {
      yield put({ type: signActions.POST_SAVE_AS_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.saveAsTemplateFal,
      });
    } else if (responseData) {
      yield put({ type: signActions.POST_SAVE_AS_TEMPLATE_SUC });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.saveAsTemplateSuc,
      });
      yield put({ type: commonActions.CLOSE_MODAL });
    }
  } catch (err) {
    yield put({ type: signActions.POST_SAVE_AS_TEMPLATE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.saveAsTemplateFal,
    });
  }
}

function* postCheck({ data }) {
  const getTaskInfo = (state) => state.sign;
  const { taskUuid, code, task_id, identity_verify_token } = yield select(
    getTaskInfo,
  );
  const dispatch = data.dispatch;
  const params = {
    sign_task_id: task_id,
    review_fields: data.review_fields,
    review_attachments: data.review_attachments,
    review_message: data.review_message,
    ...(identity_verify_token && { verify_info: { identity_verify_token } }),
  };
  if (code) {
    params.code = code;
  }
  if (taskUuid) {
    params.work_id = taskUuid;
  }
  if (data.data && data.data.verify_info) {
    params.verify_info = data.data.verify_info;
  }

  try {
    const resp = yield call(signApi.postCheck, params);

    if (resp.error_code) {
      yield put({ type: signActions.POST_CHECK_FAL });

      if (resp.error_code === 403033) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.otpSourceNotSet,
        });
      } else if (resp.error_code === 400049) {
        // NOTE: qs, duplicate tabs
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            signTaskStatus: PDF_TASK_STATUS.waiting,
            resultType: PDF_RENDER_TYPE.blocked,
          },
        });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: PDF_TASK_WARNING.duplicateWorkingState },
        });
      } else if (resp.error_code === 403034) {
        // NOTE: need identity authentications
        const { verify_info, identity_verify_token: verifyToken } = resp;

        if (verifyToken) {
          yield put({
            type: signActions.SAVE_IDENTITY_CHECK_TOKEN,
            payload: { token: verifyToken },
          });
        }

        yield put({ type: commonActions.CLOSE_MODAL });

        const modalType = getVerifyModalType(verify_info);

        yield put({
          type: commonActions.OPEN_MODAL,
          payload: {
            modalType,
            modalData: {
              receiver: verify_info,
              backup: { ...params, dispatch, data: {} },
              onSend: (newData) => dispatch(postCheckAction(newData)),
            },
          },
        });
      } else if (resp.error_code === 406031) {
        // NOTE: invalid otp
        yield put({ type: signActions.PUT_SIGN_TASK_OTP_FAL });
      } else if (resp.error_code === 406032) {
        // NOTE: otp, invalid contact information
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            signTaskStatus: PDF_TASK_STATUS.waiting,
            resultType: PDF_RENDER_TYPE.blocked,
          },
        });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: PDF_TASK_WARNING.contactInvalid },
        });
      } else if (resp.error_code === 403048) {
        // NOTE: task already been declined
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            signTaskStatus: PDF_TASK_STATUS.declined,
            resultType: PDF_RENDER_TYPE.blocked,
          },
        });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: PDF_TASK_WARNING.taskDeclined },
        });
      } else if (resp.error_code === 403065) {
        // NOTE:invalid seal, unautorized on the fly
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.invalidSeal,
        });
      } else {
        yield put({ type: commonActions.CLOSE_MODAL });
        yield put({
          type: signActions.GET_SIGN_TASK_FAL,
          payload: {
            signTaskStatus: PDF_TASK_STATUS.waiting,
            resultType: PDF_RENDER_TYPE.blocked,
          },
        });
        yield put({
          type: commonActions.OPEN_COVER,
          payload: { coverType: PDF_TASK_WARNING.signFail },
        });
      }
      return;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postCheckSuc,
    });
    yield delay(5000);

    // NOTE: proceed
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: signActions.POST_CHECK_SUC,
      payload: { isSigningDone: true },
    });
    yield put({
      type: signActions.GET_SIGN_TASK_SUC,
      payload: {
        signTaskStatus: PDF_TASK_STATUS.waiting,
        resultType: PDF_RENDER_TYPE.blocked,
        taskBlocks: [],
      },
    });
    yield put({
      type: commonActions.OPEN_COVER,
      payload: {
        coverType: PDF_TASK_WARNING.checkSucc,
      },
    });

    let toTransfer = { taskId: task_id };
    if (code) {
      toTransfer.code = code;
    }

    const respTask = yield call(signApi.getSignTask, toTransfer);

    if (respTask.error_code || !respTask.data) {
      return;
    }

    const { current_available_actions } = respTask.data;
    const is_status_review = current_available_actions?.indexOf("review") > -1;
    const is_status_sign = current_available_actions?.indexOf("sign") > -1;
    const is_status_confirm =
      current_available_actions?.indexOf("confirm") > -1;

    if (is_status_review || is_status_sign || is_status_confirm) {
      yield put({
        type: commonActions.OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.reviewComplete,
          modalData: {
            isReview: is_status_review,
            onConfirm: () => {
              Router.reload();
            },
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.POST_CHECK_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postCheckFal,
    });
  }
}

function* postReviewDone({ data }) {
  try {
    const getAuth = (state) => state.auth;
    const { isFastSigning } = yield select(getAuth);
    const getTask = (state) => state.sign;
    const { task_id, taskUuid, code, signTaskStatus, identity_verify_token } =
      yield select(getTask);

    const dispatch = data.dispatch;
    const params = {
      sign_task_id: task_id,
      ...(identity_verify_token && { verify_info: { identity_verify_token } }),
    };
    if (code) {
      params.code = code;
    }
    if (taskUuid) {
      params.work_id = taskUuid;
    }
    // NOTE: otp before sign
    if (data.data && data.data.verify_info) {
      params.verify_info = data.data.verify_info;
    }

    const resp = yield call(signApi.postReviewDone, params);

    if (resp.error_code) {
      yield put({ type: signActions.POST_REVIEW_DONE_FAL });

      if (resp.error_code === 403068) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.otpOverUsage,
        });
        return;
      }

      if (resp.error_code === 403034) {
        // NOTE: need identity authentications
        const { verify_info, identity_verify_token } = resp;

        if (identity_verify_token) {
          yield put({
            type: signActions.SAVE_IDENTITY_CHECK_TOKEN,
            payload: { token: identity_verify_token },
          });
        }

        yield put({ type: commonActions.CLOSE_MODAL });

        const modalType = getVerifyModalType(verify_info);

        yield put({
          type: commonActions.OPEN_MODAL,
          payload: {
            modalType,
            modalData: {
              receiver: verify_info,
              backup: { ...params, dispatch, data: {} },
              onSend: (newData) => dispatch(postReviewDoneAction(newData)),
            },
          },
        });
        return;
      }

      if (resp.error_code === 406031) {
        // NOTE: invalid otp
        yield put({ type: signActions.PUT_SIGN_TASK_OTP_FAL });
      }

      if (resp.error_code === 403065) {
        // NOTE: invalid seal, unautorized on the fly
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.invalidSeal,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postReviewFal,
      });
      return;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postReviewSuc,
    });
    yield delay(5000);
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: signActions.POST_REVIEW_DONE_SUC });

    if (isFastSigning) {
      yield put({
        type: signActions.GET_SIGN_TASK_SUC,
        payload: {
          signTaskStatus: signTaskStatus,
          resultType: PDF_RENDER_TYPE.blocked,
          task_id,
        },
      });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: PDF_TASK_WARNING.guestSignSucc },
      });
      return;
    }

    yield call(Router.push, `/tasks`);
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.POST_REVIEW_DONE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putPublicFormSign({ isAttaUploaded }) {
  try {
    const getPublicFormState = (state) => state.publicForm;
    const { signer_infos, signerEmail } = yield select(getPublicFormState);
    const getSign = (state) => state.sign;
    const { publicFormUuid, processIds, appliedSigns, attachments, formToken } =
      yield select(getSign);

    const signature_info = [];

    appliedSigns.map((sign) => {
      let type = sign.obj.category;
      let value = sign.obj.raw;

      if (!sign.obj.category || sign.obj.category === "guest_signature") {
        type = "guest_signature";
        value = sign.obj.signature_id || sign.obj.id || null;
      }

      if (type === "signature" && !value) {
        value = null;
      }
      if (type === "textfield" && sign.obj.is_date && !value) {
        value = null;
      }
      if (type === "textfield" && !sign.obj.is_date && !value) {
        value = "";
      }
      if (type === "checkbox" && !value) {
        value = false;
      }
      if (type === "image") {
        value = sign.obj.image_id;
      }
      if (type === "link" && !value) {
        value = "";
      }

      const isSignature =
        type === SIGNATURE_CATEGORY.SIGNATURE ||
        type === SIGNATURE_CATEGORY.INITIAL ||
        type === SIGNATURE_CATEGORY.STAMP ||
        type === SIGNATURE_CATEGORY.GUEST_SIGNATURE ||
        type === SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO;

      const isImage = sign.obj.category === "image";

      let stageTemp = {
        object_id: sign.blockid,
        type: transformFieldType(type, sign.obj),
        value,
        options: {},
      };

      const objKey = ["style", "zone"];
      objKey.map((key) => {
        if (typeof sign.obj[key] !== "undefined") {
          stageTemp[key] = sign.obj[key];
        }
      });

      const optionKey = ["date_format", "font_size", "alignment"];
      optionKey.map((key) => {
        if (typeof sign.options[key] !== "undefined") {
          stageTemp[key] = sign.options[key];
        }
      });

      const shouldSkip = (isSignature || isImage) && !stageTemp.value;

      if (shouldSkip) {
        return;
      }

      signature_info.push(stageTemp);
    });

    let attachment_info;
    if (attachments) {
      attachment_info = [];
      attachments.map((atta) => {
        if (atta.file) {
          attachment_info.push({
            attachment_id: atta.attachment_id,
            attachment_type: getFileExtension(atta.file.type),
            uploaded: isAttaUploaded ? true : atta.isUploaded,
          });
        }
      });
    }

    const plod = {
      form_token: formToken,
      signature_info,
      attachment_info,
      work_id: publicFormUuid,
    };

    let resp = yield call(signApi.putPublicFormSign, plod);
    resp = yield call(checkOtpOnSendPublicForm, {
      response: resp,
      requestData: plod,
    });

    if (resp.error_code) {
      yield put({ type: signActions.PUT_PUBLIC_FORM_SIGN_FAL });

      if (resp.error_code === 400051 && resp.attachment_upload_info) {
        yield put({ type: signActions.POST_ATTACHMENTS_UPLOAD_START });
        yield call(uploadAttachmentAllPF, {
          attachments,
          info: resp.attachment_upload_info,
          nextAction: putPublicFormSign,
          dataNextAction: { isAttaUploaded: true },
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.publicFormSignFal,
      });
      return;
    }

    yield put({ type: authActions.CLEAR_GUEST_SIGN_LAST_USE });

    (() => {
      const workId = sessionStorage.getItem("dottedsign_work_id");
      const key = `signature-${workId}`;
      sessionStorage.removeItem(key);
    })();

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putSignSuc,
    });
    yield delay(5000);
    yield put({ type: signActions.PUT_PUBLIC_FORM_SIGN_SUC });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({ type: authActions.CLEAR_GUEST_SIGN_LAST_USE });

    const orderNext = processIds[0] + 1;
    if (signer_infos[orderNext]?.signer_type === "form_signer") {
      const form_token = resp.data.form_token;
      const data = { isIni: true, form_uuid: publicFormUuid, form_token };

      yield delay(1000);
      yield put({ type: signActions.READ_PUBLIC_FORM, data });
      return;
    }

    yield put({
      type: commonActions.OPEN_COVER,
      payload: {
        coverType: signerEmail
          ? PDF_TASK_WARNING.guestSignSucc
          : PDF_TASK_WARNING.publicFormSignSucc,
      },
    });
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.PUT_PUBLIC_FORM_SIGN_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* readPublicForm({ data }) {
  try {
    const { isIni, form_uuid, ...res } = data;

    const getPublicFormState = (state) => state.publicForm;
    const { description } = yield select(getPublicFormState);

    yield put({ type: authActions.SET_PUBLIC_FORM_INI });
    yield put({ type: signActions.RESET_SIGN_ONLY });
    yield put({
      type: signActions.SET_IS_PUBLIC_FORM_SIGNING,
      payload: { form_uuid },
    });
    yield put({ type: signActions.SET_IS_PUBLIC_FORM, payload: true });

    let resp = yield call(signApi.readPublicForm, res);
    resp = yield call(checkOtpOnReadPublicForm, {
      response: resp,
      requestData: res,
    });

    if (resp.error_code) {
      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.emailFormatError,
        });
        return;
      }

      if (isIni && resp.error_code === 400901) {
        yield put({ type: signActions.READ_PUBLIC_FORM_FAL });
        yield put({
          type: commonActions.OPEN_MODAL,
          payload: {
            modalType: MODAL_TYPE.consent,
            modalData: {
              confirmData: openModalAction({
                modalType: MODAL_TYPE.publicFormSignerInfo,
                modalData: {
                  form_uuid,
                  form_token: data.form_token,
                  requisite: resp.signer_requisite,
                  role: resp.signer_role,
                  title: resp.form_name,
                  desc: description,
                },
              }),
            },
          },
        });
        return;
      }

      yield put({ type: signActions.READ_PUBLIC_FORM_FAL });
      yield put({ type: commonActions.CLOSE_MODAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: PREVIEW_ERROR.publicFormUnavailable },
      });
      return;
    }

    resp = {
      ...resp,
      data: {
        ...resp.data,
        ...parseTaskToNavbar({ ...resp.data }),
      },
    };

    const getPdf = (state) => state.pdf;
    const { viewport, pdfRotates } = yield select(getPdf);

    const reference_setting = resp.data.task_setting?.reference_settings;

    const download_link = resp.data.reference_links;

    let assignees = [];
    let processIds = [];
    let taskBlocks = [];
    let attachments;
    let appliedSignsDefault = [];
    let blkWithAction = [];
    let groupWithAction = {};
    let viewableSourceFiles = [];
    let references = [];

    resp.data.stage_infos.map((stage, idx) => {
      const task = stage.full_info;
      const isMyTurn = stage.action_type === "processing";

      if (!task.xfdf_text) {
        return null;
      }

      const xfdfBlocks = xfdf2Obj(task.xfdf_text, stage.action_type, isMyTurn);

      if (idx !== 0) {
        assignees.push({
          uid: task.stage_id,
          name: task.name,
          email: task.email,
          others: task.stage_setting,
        });
      }

      if (isMyTurn) {
        processIds.push(idx);
      }

      if (isMyTurn && task.attachment_setting?.length > 0) {
        attachments = task.attachment_setting.map((atta) => {
          return {
            ...atta,
            stage_id: task.stage_id,
          };
        });
      }

      if (isMyTurn) {
        viewableSourceFiles = task.stage_setting?.viewable_source_files || [];
      }

      const fieldGroups = task.field_setting_groups || [];

      const fields = task.field_settings;

      let stageBlocks = [];
      fields.map((field) => {
        const blk = xfdfBlocks.find((xfdf) => {
          return xfdf.id === field.field_object_id;
        });
        const { img: blkImg, ...restBlk } = blk;
        void blkImg;

        const blkOption = (() => {
          if (field.options) {
            if (!fieldGroups || !field.field_group_object_id) {
              return { ...field.options };
            }

            const group = fieldGroups.find(
              (gp) => gp.field_group_object_id === field.field_group_object_id,
            );

            if (!group) {
              return { ...field.options };
            }

            return {
              ...field.options,
              read_only: group.options?.read_only,
            };
          }

          const temp = { force: true };
          if (field.type === "textfield") {
            if (field.is_date) {
              temp.date_setting = "current_only";
            } else {
              temp.is_multi_line = true;
            }
          }
          return temp;
        })();

        const field_object_actions = getFieldObjectActions(
          task,
          field.field_object_id,
        );

        const fieldNew = {
          ...(field.fieldType === fieldTypes.image
            ? { ...restBlk }
            : { ...blk }),
          ...field,
          options: blkOption,
          id: field.field_object_id,
          page: field.page + 1,
          coord: getMyCoord(
            field.coord,
            viewport[field.page],
            pdfRotates[field.page],
          ),
          field_object_actions,
          action_info: field.action_info,
        };

        const imageInfos = resp.data?.image_info?.images;
        const imageItem = imageInfos?.find(
          (info) => info.id === parseInt(field.field_value),
        );

        if (field.field_type === "signature") {
          fieldNew.type = "signature";
        }
        if (field.field_type === "textfield") {
          fieldNew.type = "textfield";
          fieldNew.value = field.field_value;
          fieldNew.is_date = false;
        }
        if (field.field_type === "datefield") {
          fieldNew.type = "textfield";
          fieldNew.value = field.field_value;
          fieldNew.is_date = true;
        }
        if (field.field_type === "checkbox") {
          fieldNew.type = "checkbox";
          fieldNew.value = field.field_value;
          fieldNew.style = 0;
        }
        if (field.field_type === "radio") {
          fieldNew.type = "checkbox";
          fieldNew.value = field.field_value;
          fieldNew.style = 1;
        }
        if (field.field_type === "image") {
          fieldNew.type = "image";
          fieldNew.value = imageItem?.raw || null;
        }
        if (field.field_type === "link") {
          fieldNew.type = "link";
          fieldNew.value = field.field_value;
        }

        stageBlocks.push(fieldNew);
      });

      taskBlocks.push({
        order: idx + 1,
        stageId: stage.stage_id,
        isMyTurn,
        status: stage.action_type,
        blocks: stageBlocks,
        fieldGroups,
      });

      if (isMyTurn) {
        fieldGroups.map((group) => {
          groupWithAction[group.field_group_object_id] = {
            show: group.action_info?.show,
            items: [],
          };
        });

        stageBlocks.map((blk) => {
          const main = {
            stageid: task.stage_id,
            blockid: blk.field_object_id,
            options: blk.options,
            field_group_object_id: blk.field_group_object_id,
          };

          const obj = (() => {
            switch (blk.field_type) {
              case "signature": {
                return {
                  category: "signature",
                  raw: null,
                };
              }

              case "textfield":
                return {
                  category: "textfield",
                  raw: blk.options.default || "",
                };

              case "datefield":
                return {
                  category: "textfield",
                  date_format: "yyyy/mm/dd",
                  raw: blk.options.default || null,
                  zone: 8,
                  is_date: true,
                };

              case "radio":
                return {
                  category: "checkbox",
                  raw: blk.options.default || false,
                  style: 1,
                };

              case "checkbox":
                return {
                  category: "checkbox",
                  raw: blk.options.default || false,
                  style: 0,
                };

              case "link":
                return {
                  category: "link",
                  raw: blk.options.default || null,
                };

              case "image":
                return {
                  category: "image",
                  raw: blk.options.default || null,
                };

              default:
                return {};
            }
          })();

          main.obj = obj;
          appliedSignsDefault.push({
            ...main,
            obj,
          });

          blkWithAction[blk.field_object_id] = {
            show: blk.action_info?.show,
            value: blk.options.default,
            field_type: blk.field_type,
            field_group_object_id: blk.field_group_object_id,
            field_object_actions: blk.field_object_actions,
          };

          if (blk.field_group_object_id) {
            const groupId = blk.field_group_object_id;
            groupWithAction[groupId].items.push(blk.field_object_id);
          }
        });
      }
    });

    if (reference_setting && reference_setting.length > 0) {
      const newReferences = referencesTransformApi(
        reference_setting,
        assignees,
      );
      references = newReferences.filter(
        (reference) => reference.isViewableInProcessing,
      );
    }

    const plod = {
      task_id: resp.data.task_id,
      resultType: PDF_RENDER_TYPE.edit,
      processIds,
      isMyTurn: true,
      has_order: true,
      signTaskStatus: "waiting",
      taskBlocks,
      formToken: data.form_token,
      attachments,
      viewable_source_files: viewableSourceFiles,
      files: resp.data?.file_merge_info?.files || [],
      group_setting_info: resp.data.group_setting_info,
      references,
      reference_setting,
      download_link,
      navbar: resp.data?.navbar || {},
      isFastSigning: true,
    };

    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: signActions.READ_PUBLIC_FORM_SUC,
      payload: plod,
    });

    yield put({
      type: signActions.UPDATE_APPLIED_SIGNS_SUC,
      payload: appliedSignsDefault,
    });
  } catch (err) {
    console.log(err);
    yield put({ type: signActions.READ_PUBLIC_FORM_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

const eventListeners = [
  takeEvery(signActions.GET_SIGNS, getSigns),
  takeLatest(signActions.GET_SIGN_TASK, getSignTask),
  takeLatest(signActions.GET_PREVIEW_SHARE_SIGN_TASK, getPreviewShareSignTask),
  takeLatest(signActions.GET_PREVIEW_SHARE_LINK, getPreviewShareLink),
  takeEvery(signActions.PUT_SIGN_TASK, putSignTask),
  takeEvery(signActions.DELETE_SIGN_TASK, deleteSignTask),
  takeEvery(signActions.SAVE_SIGN, saveSign),
  takeEvery(signActions.CREATE_STAMP_SIGN, createStampSign),
  takeEvery(signActions.SAVE_SIGN_GUEST, saveSignGuest),
  takeEvery(signActions.DELETE_SIGN, deleteSign),
  takeEvery(signActions.GET_EMAIL_OUT, getEmailOut),
  takeEvery(signActions.GET_DOWNLOAD_FILE, getDownloadFile),
  takeEvery(signActions.GET_AUDIT_TRAIL, getAuditTrail),
  takeEvery(signActions.GET_TASK_FILE, getTaskFile),
  takeEvery(signActions.GET_AUDIT_TRAIL_HISTORY, getAuditTrailHistory),
  takeEvery(signActions.UPDATE_APPLIED_SIGNS, updateAppliedSigns),
  takeEvery(signActions.GET_OVERALL, getOverall),
  takeEvery(signActions.GET_TASKS, getTasks),
  takeEvery(signActions.GET_PUBLIC_FORM_TASKS, getPublicFormTasks),
  takeEvery(signActions.PUT_FILE_NAME, putFileName),
  takeEvery(signActions.POST_SETUP, postSetup),
  takeEvery(signActions.POST_OTP_RESEND, postOtpResend),
  takeEvery(signActions.POST_FAST_SIGNING_CONSENT, postFastSigningConsent),
  takeEvery(signActions.POST_INVITE_SIGN_RESEND, postInviteSignResend),
  takeEvery(signActions.POST_NOTIFY_SENDER, postNotifySender),
  takeEvery(signActions.POST_CHANGE_OWNER, postChangeOwner),
  takeEvery(signActions.POST_CHANGE_SIGNER, putChangeSigner),
  takeEvery(signActions.RESET_SIGN, resetSign),
  takeEvery(signActions.CHANGE_FILE_NAME, changeFileName),
  takeEvery(signActions.POST_DECLINE, declineToSign),
  takeEvery(signActions.POST_KIOSK_VERIFY, postKioskVerify),
  takeEvery(signActions.PUT_KIOSK_SIGN, putKioskSign),
  takeEvery(signActions.FETCH_DRAFT, fetchDraft),
  takeEvery(signActions.DOWNLOAD_ATTACHMENT, downloadAttachment),
  takeEvery(signActions.GET_GRA_AUTHORIZE_STATUS, getGraAuthorizeStatus),
  takeEvery(signActions.POST_REISSUETASK, postReissueTask),
  takeEvery(signActions.POST_DUPLLICATE_SIGN_TASK, postDuplicateSignTask),
  takeEvery(signActions.POST_SAVE_AS_TEMPLATE, postSaveAsTemplate),
  takeEvery(signActions.POST_CHECK, postCheck),
  takeEvery(signActions.POST_REVIEW_DONE, postReviewDone),
  takeEvery(signActions.PUT_PUBLIC_FORM_SIGN, putPublicFormSign),
  takeEvery(signActions.READ_PUBLIC_FORM, readPublicForm),
];

export default eventListeners;
