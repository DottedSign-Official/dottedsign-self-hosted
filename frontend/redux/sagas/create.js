import {
  call,
  put,
  takeEvery,
  delay,
  select,
  race,
  all,
  take,
} from "redux-saga/effects";
import Router from "next/router";
import uuid from "uuid/v1";
import { parse } from "papaparse";
import jschardet from "jschardet";

import * as commonActions from "../../constants/commonTypes";
import * as memberActions from "../../constants/memberTypes";
import * as createActions from "../../constants/createTypes";
import { RESET_PREVIEW } from "../../constants/previewTypes";
import { RESET_PDF } from "../../constants/pdfTypes";
import * as signActions from "../../constants/signTypes";

import * as createApi from "../../apis/create";
import * as signApi from "../../apis/sign";

import { isEmail, isPhone } from "../../helpers/utility";
import { CHT_VERIFY_TYPES } from "../../helpers/assignees/cht";
import xfdf2Obj from "../../helpers/xfdf";
import getAllViewport from "../../helpers/getViewport";
import { getImageFormat } from "../../helpers/image";
import { getPdfCoord, getMyCoord } from "../../helpers/coord2Styles";
import {
  getDoc,
  getPdfDocDataURL,
  formatFileSize,
  getDocTotalPages,
  getDocAndFileSize,
  getDocFile,
  getDocTotalPagesAndFileSize,
} from "../../helpers/others";
import { uploadFile } from "../../helpers/uploadFile";
import {
  unixToString,
  convertDatetimeFormat,
  localDatetimeToUnix,
} from "../../helpers/time";
import { genStateChange } from "./socket";
import toastStatus from "../../constants/toast";
import {
  PDF_TASK_STATUS,
  TASK_STATUS_BAR_ITEMS,
  EMBEDDED_STATUS,
  fieldTypes,
  systemTimeI18Keys,
  STAGE_ACTION,
} from "../../constants/constants";
import {
  getAssigneesWarnings,
  hasWarning,
} from "../../helpers/assignees/warning";
import { filterSignerAssignes } from "../../helpers/assignees/review";

export function* fetchFileData({
  file,
  isCheckSettings,
  isRevertDraft,
  isGetSignTask,
}) {
  let fileName, fileId, fileData, fileUrl, pageNum, fileSizeText, vpData;

  if (isCheckSettings) {
    fileName = file.name.replace(/.pdf/gi, "");
    fileId = `file__${uuid()}`;
    fileData = file;
    pageNum = yield call(getDocTotalPages, file);
    fileSizeText = formatFileSize(file.size);
  } else if (isRevertDraft || isGetSignTask) {
    const { doc, fileSize } = yield call(getDocAndFileSize, file.download_link);
    fileName = file.file_name;
    fileId = file.task_id;
    if (isGetSignTask) {
      fileUrl = yield call(getPdfDocDataURL, doc);
      vpData = yield call(getAllViewport, doc);
    } else {
      fileUrl = file.download_link;
    }
    pageNum = doc._pdfInfo.numPages;
    fileSizeText = formatFileSize(fileSize);
  }

  return {
    fileUrl,
    file: fileData,
    fileName,
    fileId,
    pageNum,
    fileSizeText,
    vpData,
  };
}

function* checkSettings({ data }) {
  try {
    const getCreateInfo = (state) => state.create;
    const { templateId, thumbnail, formId } = yield select(getCreateInfo);
    const { isPublicForm } = yield select((state) => state.publicForm);

    const { files, assignes, assigneesWarnings, nextPage, isTemplate } = data;
    const isEnvelope = nextPage.includes("create-envelope");
    let isBlank = false;
    let isMailInvalid = false;

    let isVerifyInvalid = false;

    if (hasWarning(assigneesWarnings)) {
      isVerifyInvalid = true;
    }

    if (!templateId && (!files || files.length < 1)) {
      isBlank = true;
    }

    if (!assignes || assignes.length < 1) {
      isBlank = true;
    }

    assignes.map((assigne) => {
      if (isTemplate || assigne.signer_type === "form_signer") {
        if (!assigne.role || assigne.role.length < 1) {
          isBlank = true;
        }
        return null;
      }

      if (
        !assigne.email ||
        assigne.email.length < 1 ||
        !assigne.name ||
        assigne.name.length < 1
      ) {
        isBlank = true;
      }

      if (!isEmail(assigne.email)) {
        isMailInvalid = true;
      }
    });

    if (isEnvelope) {
      const results = yield all(
        files.map((file) =>
          call(fetchFileData, { file, isCheckSettings: true }),
        ),
      );

      yield put({
        type: createActions.SET_FILE_LIST,
        payload: results,
      });

      yield put({
        type: createActions.SET_FILE_FOCUS,
        payload: results[0],
      });
    }

    if (isBlank) {
      yield put({ type: createActions.CHECK_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: isPublicForm
          ? toastStatus.publicFormCheckFal
          : toastStatus.checkFal,
      });
    } else if (isMailInvalid) {
      yield put({ type: createActions.CHECK_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.notEmail,
      });
    } else if (isVerifyInvalid) {
      yield put({ type: createActions.CHECK_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.verifyInvalid,
      });
    } else if (isPublicForm && formId) {
      // NOTE: then redirect
      yield delay(1000);
      yield put({ type: createActions.CHECK_SETTINGS_SUC });
      yield call(Router.push, nextPage);
    } else {
      if (!templateId) {
        // NOTE: do preview file url
        yield put({
          type: createActions.SET_FILE_URL,
          payload: { url: URL.createObjectURL(files[0]) },
        });
        // NOTE: clear stages if any
        yield put({ type: createActions.CLEAR_STAGES });
      }

      if (templateId && !thumbnail) {
        // NOTE: thumbnail will be null because replace document
        yield put({
          type: createActions.SET_FILE_URL,
          payload: { url: URL.createObjectURL(files[0]) },
        });
      }

      // NOTE: then redirect
      yield delay(1000);
      yield put({ type: createActions.CHECK_SETTINGS_SUC });
      yield call(Router.push, nextPage);
    }
  } catch (error) {
    yield put({ type: createActions.CHECK_SETTINGS_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.checkFal,
    });
  }
}

function* getAssigneeSystemCAList({ payload }) {
  try {
    const { email } = payload;
    const response = yield call(fetchAssigneeSystemCAList, email);
    yield put({
      type: createActions.GET_ASSIGNEE_SYSTEM_CA_LIST_SUC,
      payload: { isAccess: !!response.length, CAList: response },
    });
  } catch (err) {
    yield put({ type: createActions.GET_ASSIGNEE_SYSTEM_CA_LIST_FAL });
    console.error(err);
  }
}

function* fetchAssigneeSystemCAList(email) {
  const response = yield call(createApi.getAssigneeSystemCAList, { email });
  if (response.data) {
    return response.data;
  } else {
    return [];
  }
}

function isUsingSystemCA(assignee) {
  if (!assignee.email.trim()) {
    return false;
  }

  const hasSystemCA = assignee?.verify?.find(
    ({ verify_type }) => verify_type === "cht_system",
  );

  if (!hasSystemCA) {
    return false;
  }

  return true;
}

function* getAssigneeSystemCAInfo(assignee) {
  const systemCAList = yield call(fetchAssigneeSystemCAList, assignee.email);

  const getSystemCAInfo = (assignee, systemCAList) => {
    const getSystemCAIdentifier = (assignee) => {
      const { verify } = assignee;
      const chtVerify = verify.find(
        ({ verify_type }) => verify_type === "cht_system",
      );
      return chtVerify?.verify_source?.id;
    };

    return systemCAList.find(
      ({ id }) => id === getSystemCAIdentifier(assignee),
    );
  };

  return getSystemCAInfo(assignee, systemCAList);
}

function* reloadSystemCAs({ assignees, assigneeNeedsToReload }) {
  const correspondSystemCASource = yield all(
    assignees.map((assignee) =>
      assigneeNeedsToReload(assignee)
        ? call(getAssigneeSystemCAInfo, assignee)
        : null,
    ),
  );

  const assigneesWithSystemCASource = assignees.map((assignee, index) => {
    if (assigneeNeedsToReload(assignee)) {
      const verify_source = correspondSystemCASource[index];

      return {
        ...assignee,
        verify: assignee.verify.map((data) => ({
          ...data,
          verify_source: {
            // NOTE: remain old id when email typo can still restore system ca.
            id: data.verify_source?.id,
            ...verify_source,
          },
        })),
      };
    }

    return assignee;
  });

  return assigneesWithSystemCASource;
}

function* setAssignes({ data }) {
  try {
    const { assignes, isAdd } = data;
    const getCreate = (state) => state.create;
    const { stages, fieldGroups, isTemplate } = yield select(getCreate);

    const assigneesUnchecked = assignes.map((ass, idx) => {
      const stage_setting = (() => {
        if (ass.action === STAGE_ACTION.review) {
          return null;
        }

        const {
          forward_enable = false,
          decline_enable = true,
          viewable_in_processing = true,
          viewable_in_completed = true,
          reviewed_skip_confirm = true,
        } = ass.stage_setting || {};

        if (ass.isMe) {
          return {
            forward_enable: true,
            decline_enable: false,
            viewable_in_processing: true,
            viewable_in_completed: true,
            reviewed_skip_confirm,
          };
        }

        return {
          forward_enable,
          decline_enable,
          viewable_in_processing,
          viewable_in_completed,
          reviewed_skip_confirm,
        };
      })();

      return {
        ...ass,
        key: idx,
        stage_setting,
      };
    });

    const oldAssignees = yield select((state) => state.create.assignes);
    const assigneeEmailHasChanged = (assignee) => {
      return oldAssignees.find(
        ({ uid, email }) => assignee.uid === uid && assignee.email !== email,
      );
    };
    const newAssignes = yield call(reloadSystemCAs, {
      assignees: assigneesUnchecked,
      assigneeNeedsToReload: (assignee) =>
        assigneeEmailHasChanged(assignee) && isUsingSystemCA(assignee),
    });
    const assigneesWarnings = getAssigneesWarnings(newAssignes, isTemplate);

    yield put({
      type: createActions.SET_ASSIGNES_SUCC,
      assignes: newAssignes,
      assigneesWarnings,
    });

    if (!isAdd && stages && stages.length > 0) {
      let newStages = [];
      stages.map((stage) => {
        let newAss = newAssignes.find((ass) => ass.uid === stage.assigne.uid);
        if (typeof newAss === "undefined") {
          return;
        }

        const options = newAss.isMe
          ? {
              ...stage.options,
              read_only: false,
            }
          : stage.options;

        if (newAss) {
          newStages.push({
            ...stage,
            assigne: newAss,
            options,
          });
        }
      });

      yield put({ type: createActions.SET_STAGES, stages: newStages });

      let newGroups = [];
      fieldGroups.forEach((group) => {
        const groupStages = newStages.filter(
          (stage) =>
            stage.field_group_object_id === group.field_group_object_id,
        );
        if (!groupStages.length) {
          return;
        }

        const isMe = groupStages.every((stage) => stage.assigne?.isMe);

        const options = isMe
          ? {
              ...group.options,
              read_only: false,
            }
          : group.options;

        newGroups.push({
          ...group,
          options,
        });
      });

      yield put({
        type: createActions.SET_FIELD_GROUPS,
        payload: newGroups,
      });
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

// NOTE: create
function* putDraft({ data }) {
  try {
    // NOTE: set create type
    yield put({ type: createActions.SET_CREATE_TYPE, payload: "put_draft" });

    // NOTE: modify draft
    const resp = yield call(modifyDraft, { data });
    if (!resp) {
      return null;
    }

    // NOTE: wait for socket
    const { payload } = yield race({
      timeout: delay(5000),
    });
    if (!payload) {
      const respTask = yield call(
        signApi.getSignTask,
        data.is_envelope && data.envelopeId
          ? { envelopeId: data.envelopeId }
          : { taskId: data.taskId },
      );
      if (!respTask.data.xfdf_ready) {
        yield call(putDraftFal);
        return null;
      }
    }

    // NOTE: succ
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putDraftSuc,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    if ("draft" in TASK_STATUS_BAR_ITEMS) {
      yield put({
        type: signActions.SET_FOCUS,
        payload: "draft",
      });
    }
    yield delay(4000);
    yield put({ type: createActions.PUT_DRAFT_SUC });
    yield call(Router.push, "/tasks");
  } catch (err) {
    yield call(putDraftFal);
  }
}
function* postDraftToCreate({ data }) {
  try {
    // NOTE: set create type
    yield put({
      type: createActions.SET_CREATE_TYPE,
      payload: "post_draft_to_create",
    });

    // NOTE: put draft
    const resp = yield call(modifyDraft, { data });
    if (!resp) {
      return null;
    }

    // NOTE: start
    const resp2 = yield call(startDraft, {
      task_id: data.taskId,
      envelope_id: data.envelopeId,
    });
    if (resp2.error_code) {
      yield call(postDraftToTaskFal);
      return null;
    }

    // NOTE: wait for socket
    const { payload } = yield race({
      timeout: delay(5000),
    });

    if (!payload) {
      const respTask = yield call(
        signApi.getSignTask,
        data.is_envelope && data.envelopeId
          ? { envelopeId: data.envelopeId }
          : { taskId: data.taskId },
      );
      if (respTask.error_code) {
        yield call(postDraftToTaskFal);
        return null;
      }
    }

    // NOTE: succ
    yield put({ type: createActions.POST_CREATE_SUC });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: data.is_encrypted
        ? toastStatus.createSucEncrypted
        : toastStatus.createSuc,
      toastId: "ReviewSend-Send-Suc-GetSignatures",
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield take(commonActions.CLOSE_TOAST);
    if (data.is_envelope && data.envelopeId) {
      yield put({ type: RESET_PREVIEW });
      yield call(Router.push, `/task?envelopeId=${data.envelopeId}`);
    } else {
      yield call(Router.push, `/task?taskId=${data.taskId}`);
    }
  } catch (err) {
    yield call(postDraftToTaskFal);
  }
}

function* postCreate({ data }) {
  try {
    // NOTE: set create type
    yield put({ type: createActions.SET_CREATE_TYPE, payload: "post_create" });

    // NOTE: create
    const resp = yield call(createDraft, { data });
    if (!resp) {
      yield put({ type: createActions.POST_CREATE_FAL });
      return null;
    }

    // NOTE: start
    const resp2 = yield call(startDraft, {
      task_id: resp.taskId,
      envelope_id: resp.envelopeId,
    });

    if (resp2.error_code) {
      yield call(postCreateFal);
      return null;
    }

    // NOTE: socket & result
    const { payload } = yield race({
      payload: call(genStateChange, { key: "taskStatusChanged" }),
      timeout: delay(120000),
    });

    if (!payload) {
      const respTask = yield call(
        signApi.getSignTask,
        data.is_envelope && resp.envelopeId
          ? { envelopeId: resp.envelopeId }
          : { taskId: resp.taskId },
      );
      if (
        respTask.error_code ||
        (respTask.data && respTask.data.status === PDF_TASK_STATUS.draft)
      ) {
        yield call(postCreateFal);
        return null;
      }
    }

    // NOTE: succ
    yield put({ type: createActions.POST_CREATE_SUC });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: data.is_encrypted
        ? toastStatus.createSucEncrypted
        : toastStatus.createSuc,
      toastId: "ReviewSend-Send-Suc-GetSignatures",
    });
    yield take(commonActions.CLOSE_TOAST);
    if (data.is_envelope && resp.envelopeId) {
      yield call(Router.push, `/task?envelopeId=${resp.envelopeId}`);
    } else {
      yield call(Router.push, `/task?taskId=${resp.taskId}`);
    }
  } catch (err) {
    yield call(postCreateFal);
  }
}

function* postDraft({ data }) {
  try {
    // NOTE: set create type
    yield put({ type: createActions.SET_CREATE_TYPE, payload: "post_draft" });

    // NOTE: create
    const resp = yield call(createDraft, { data });
    if (!resp) {
      yield put({ type: createActions.POST_CREATE_FAL });
      return null;
    }

    // NOTE: succ
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.draftSuc,
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    if ("draft" in TASK_STATUS_BAR_ITEMS) {
      yield put({
        type: signActions.SET_FOCUS,
        payload: "draft",
      });
    }
    yield delay(5000);
    yield put({ type: createActions.POST_DRAFT_SUC });
    yield call(Router.push, "/tasks");
  } catch (err) {
    yield call(postDraftFal);
  }
}

// NOTE: template
function* postTemplate({ data }) {
  try {
    const getCreateInfo = (state) => state.create;
    const {
      files,
      fileName,
      isOrder,
      assignes,
      stages,
      attachments,
      labels,
      ccInfos,
      fieldGroups,
    } = yield select(getCreateInfo);
    const params = {
      files,
      file_name: fileName,
      has_order: isOrder,
      assignes,
      stages,
      attachments,
      labels: data.labels || labels,
      templateCode: data?.templateCode,
      ccInfos,
      fieldGroups,
      is_encrypted: data.is_encrypted,
      completion_password: data.completion_password,
    };

    // NOTE: create
    const resp = yield call(createDraft, { data: params, isTemplate: true });
    if (!resp) {
      return null;
    }

    // NOTE: succ
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postTemplateSuc,
    });
    yield take(commonActions.CLOSE_TOAST);
    yield call(Router.push, "/settings/template");
    yield put({ type: createActions.POST_TEMPLATE_SUC });
  } catch (err) {
    yield call(postTemplateFal);
  }
}
function* putTemplate({ data }) {
  try {
    const getCreateInfo = (state) => state.create;
    const {
      templateId,
      fileName,
      isOrder,
      assignes,
      stages,
      attachments,
      labels,
      ccInfos,
      files,
      isReplaceTemplate,
      fieldGroups,
    } = yield select(getCreateInfo);
    const param = {
      templateId,
      file_name: fileName,
      has_order: isOrder,
      assignes,
      stages,
      attachments,
      labels: data.labels || labels,
      templateCode: data.templateCode,
      ccInfos,
      isReplaceTemplate,
      fieldGroups,
      is_encrypted: data.is_encrypted,
      completion_password: data.completion_password,
    };

    const resp = yield call(modifyDraft, { data: param, isTemplate: true });
    if (!resp) {
      return null;
    }

    if (resp.data.upload_link) {
      const formData = new FormData();
      formData.append("file", files[0]);
      yield call(async () => {
        const response = await fetch(resp.data.upload_link, {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`File upload failed with status: ${response.status}`);
        }
      });
    }

    // NOTE: wait for socket
    const { payload } = yield race({
      timeout: delay(5000),
    });
    if (!payload) {
      const respTemplate = yield call(createApi.getTemplate, templateId);
      if (respTemplate.error_code) {
        yield call(putTemplateFal);
        return null;
      }
    }
    // NOTE: succ
    yield put({ type: createActions.PUT_TEMPLATE_SUC });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putTemplateSuc,
    });
    yield delay(4000);
    yield call(Router.push, "/settings/template");
  } catch (err) {
    yield call(putTemplateFal);
  }
}
function* getTemplate({ data }) {
  const { templateId, isTemplateEdit } = data;

  try {
    const resp = yield call(createApi.getTemplate, templateId);
    if (resp.error_code) {
      yield put({ type: createActions.GET_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.getTemplateFal,
      });

      if (isTemplateEdit) {
        yield delay(5000);
        yield call(Router.push, "/settings/template");
      }

      return null;
    }

    yield put({
      type: createActions.SET_FILE_URL,
      payload: {
        url: resp.data.download_link,
      },
    });

    const getPublicFormState = (state) => state.publicForm;
    const { isPublicForm } = yield select(getPublicFormState);

    // NOTE: assignes
    let assignes = [];
    let stageIdUidMap = {}; // NOTE: reviewer → base signer
    resp.data.detail.map((usr, idx) => {
      const stage_setting = (() => {
        if (usr.action === STAGE_ACTION.review) {
          return null;
        }

        const {
          forward_enable = false,
          decline_enable = true,
          viewable_in_processing = true,
          viewable_in_completed = true,
          reviewed_skip_confirm = true,
        } = usr.stage_setting || {};

        return {
          forward_enable,
          decline_enable,
          viewable_in_processing,
          viewable_in_completed,
          reviewed_skip_confirm,
        };
      })();

      let signer = {
        key: idx,
        uid: `user-${uuid()}`,
        action: usr.action,
        stage_setting,
        actor_info: usr.actor_info,
      };

      if (isPublicForm && idx === 0) {
        const formSigner = {
          signer_type: "form_signer",
          reviewed_by: [],
          requisite: {
            name: "required",
            email: "optional",
          },
        };
        signer = {
          ...signer,
          ...formSigner,
          role: usr.role,
        };
      }

      if (usr.action === STAGE_ACTION.sign) {
        stageIdUidMap[usr.stage_id] = signer.uid;
      }
      if (usr.action === STAGE_ACTION.review) {
        signer.actor_info = {
          ...signer.actor_info,
          base_uid: stageIdUidMap[usr.actor_info.base_stage_id],
        };
      }

      assignes.push(
        isTemplateEdit
          ? {
              ...signer,
              role: usr.role,
            }
          : {
              ...signer,
              name: usr.role,
              email: "",
            },
      );
    });

    // NOTE: attachments
    let attachments = [];
    resp.data.detail.map((usr, idx) => {
      const signer = assignes[idx];

      if (usr.attachment_setting && usr.attachment_setting.length > 0) {
        usr.attachment_setting.map((att) => {
          attachments.push({
            ...att,
            uuid: uuid(),
            signer,
          });
        });
      }
    });

    // NOTE: stages
    const doc = yield call(getDoc, resp.data.download_link);
    const docFile = yield call(getDocFile, doc, resp.data.file_name);
    const pdfDataUrl = yield call(getPdfDocDataURL, doc);
    const vpData = yield call(getAllViewport, doc);
    const numPages = doc.numPages;

    if (!vpData) {
      yield put({ type: createActions.GET_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    const { viewport, rotates } = vpData;

    let stages = [];
    let fieldGroups = [];

    resp.data.detail.map((usr, idx) => {
      if (usr.action === STAGE_ACTION.review) {
        return;
      }

      const isGroupReadOnly = (groupId) =>
        (usr.field_setting_groups || []).some(
          (g) => g.field_group_object_id === groupId && g.options?.read_only,
        );

      let xfdf = xfdf2Obj(usr.xfdf_text);
      // NOTE: coords should revert to 0 degree based
      xfdf.forEach((stage) => {
        const coordOri = stage.coord.map((cor) => parseInt(cor));
        const coordNew = getMyCoord(
          coordOri,
          viewport[stage.page - 1],
          rotates[stage.page - 1],
        );

        const setting = usr?.field_settings?.find(
          (itm) => itm.field_object_id === stage.id,
        );

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
            fieldType = setting.field_type;
          } else if (setting?.field_type === fieldTypes.image) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_image";
            img = setting.field_value
              ? resp.data.image_info?.images?.find(
                  (info) => info.id === parseInt(setting.field_value),
                )?.raw || null
              : null;
          } else if (setting?.field_type === fieldTypes.link) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_link";
          } else if (setting?.field_type === fieldTypes.systemTime) {
            fieldType = setting.field_type;
            defaultPlaceholder = systemTimeI18Keys[setting.options.format];
          } else {
            fieldType = setting.field_type;
          }
        }

        let tempStage = {
          assigne: assignes[idx],
          coords: coordNew,
          id: stage.id,
          page: stage.page,
          text: defaultPlaceholder,
          type: fieldType,
          ...(img ? { img } : {}),
          options: setting?.options,
        };

        if (setting?.field_type === fieldTypes.date) {
          tempStage.is_date = stage.is_date;
        }
        if (stage.style === 0 || stage.style === 1) {
          tempStage.style = stage.style;
        }

        if (setting?.custom_id) {
          tempStage.custom_id = setting.custom_id;
        }

        if (setting?.field_group_object_id) {
          tempStage.field_group_object_id = setting.field_group_object_id;
        }

        if (isGroupReadOnly(tempStage.field_group_object_id)) {
          tempStage.options = {
            ...(tempStage.options || {}),
            read_only: true,
          };
        }

        stages.push(tempStage);
      });

      // NOTE: fieldGroups
      usr.field_setting_groups?.map((g) => {
        fieldGroups.push(g);
      });
    });

    // NOTE: labels
    let labels = [];
    Object.keys(resp.data.tags).forEach((key) => {
      if (resp.data.tags[key]) {
        labels.push(key);
      }
    });

    // NOTE: files
    const files = [docFile];
    const tmpFiles = [docFile];

    // NOTE: done
    const toTransfer = {
      fileUrl: pdfDataUrl,
      fileName: resp.data.file_name,
      isOrder: resp.data.has_order,
      assignes,
      stages,
      fieldGroups,
      attachments,
      labels,
      templateId,
      isTemplateEdit,
      thumbnail: resp.data.thumbnail,
      shareInfo: resp.data.share_info,
      templateCode: resp.data.code || "",
      templatePages: numPages,
      files,
      tmpFiles,
      is_encrypted: resp.data.is_encrypted,
      completion_password: resp.data.completion_password,
    };

    if (isPublicForm) {
      toTransfer.isOrder = true;
    }

    yield put({ type: createActions.GET_TEMPLATE_SUC, payload: toTransfer });
  } catch (err) {
    console.log(err);
    yield put({ type: createActions.GET_TEMPLATE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

// NOTE: result
function* postCreateFal() {
  yield put({ type: createActions.POST_CREATE_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.commonDraftError,
  });
}
function* postDraftFal() {
  yield put({ type: createActions.POST_DRAFT_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.commonDraftError,
  });
}
function* putDraftFal() {
  yield put({ type: createActions.PUT_DRAFT_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.commonDraftError,
  });
}
function* postDraftToTaskFal() {
  yield put({ type: createActions.PUT_DRAFT_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.commonDraftError,
  });
}
function* postTemplateFal() {
  yield put({ type: createActions.POST_TEMPLATE_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.postTemplateFal,
  });
}
function* putTemplateFal() {
  yield put({ type: createActions.PUT_TEMPLATE_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.putTemplateFal,
  });
}
function* postSignAndSendFal() {
  yield put({ type: createActions.POST_SIGN_AND_SEND_FAL });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.postSignAndSendFal,
  });
}

// NOTE: funcs
// NOTE: refactor data
function* prepareDraftData({ data, isTemplate }) {
  try {
    const getPdf = (state) => state.pdf;
    const { viewport, pdfRotates } = yield select(getPdf);
    const getLicense = (state) => state.license.data;
    const licenseData = yield select(getLicense);
    const {
      envelopeId,
      file_name,
      is_envelope,
      envelope_name,
      file_list,
      has_order,
      assignes,
      assigneesWarnings,
      stages,
      fieldGroups,
      attachments,
      labels,
      forget_remind,
      deadline,
      expire_remind,
      remind_days_before_expire,
      receiver_lang,
      message,
      templateCode,
      msgRequestReceivers,
      msgCompletedReceivers,
      references,
      completedMessage,
      completedReferences,
      ccInfos,
      isReplaceTemplate,
      isPublicForm,
      is_encrypted,
      completion_password,
    } = data;

    const key = isTemplate ? "role" : "email";

    // NOTE: key transformation (envelope_file_id, task_id) based on envelope state
    const isCreatingEnvelope = is_envelope && !envelopeId;
    const isEditingDraftEnvelope = is_envelope && envelopeId;

    // NOTE: Check, assignes
    if (!assignes || assignes.length < 1) {
      return {
        isFailed: true,
        error: toastStatus.noAssigne,
      };
    }

    // NOTE: Check, assignes has role/email/name
    let isBlank = false;
    let isMailInvalid = false;
    assignes.map((assigne) => {
      if (isTemplate || assigne.signer_type === "form_signer") {
        if (!assigne.role || assigne.role.length < 1) {
          isBlank = true;
        }
        return null;
      }

      if (
        !assigne.email ||
        assigne.email.length < 1 ||
        !assigne.name ||
        assigne.name.length < 1
      ) {
        isBlank = true;
      }

      if (!isEmail(assigne.email)) {
        isMailInvalid = true;
      }
    });

    if (isBlank) {
      return {
        isFailed: true,
        error: toastStatus.publicFormCheckFal,
      };
    } else if (isMailInvalid) {
      return {
        isFailed: true,
        error: toastStatus.notEmail,
      };
    }

    // NOTE: Check, ccInfos
    if (ccInfos.length > 0) {
      let ccFailToast;
      const isCcInfosValid = (() => {
        const emailSet = new Set();

        for (const obj of ccInfos) {
          const { name, email } = obj;

          if (!name || !email) {
            ccFailToast = "ccHasEmpty";
            return false;
          }

          if (!isEmail(email)) {
            ccFailToast = "emailFormatError";
            return false;
          }

          if (emailSet.has(email)) {
            ccFailToast = "ccHasDuplicateEmail";
            return false;
          }
          emailSet.add(email);
        }

        return true;
      })();

      if (!isCcInfosValid) {
        return {
          isFailed: true,
          error: toastStatus[ccFailToast],
        };
      }
    }

    // NOTE: Check; Each signer must have at least one signature field in every file.
    if (is_envelope) {
      const allSignerHaveStageInEveryFile = assignes.every((assigne) =>
        file_list.every((file) =>
          stages.some(
            (stage) =>
              stage.envelopeFileId === file.envelope_file_id &&
              stage.assigne.uid === assigne.uid,
          ),
        ),
      );
      if (!allSignerHaveStageInEveryFile) {
        return {
          isFailed: true,
          error: toastStatus.envelopeAtLeastOneField,
        };
      }
    }

    if (is_encrypted && !licenseData?.setting?.encryptable_enable) {
      return {
        isFailed: true,
      };
    }

    if (is_encrypted) {
      const hasChtAuth = assignes.some((ass) =>
        ass.verify?.some((verify) =>
          CHT_VERIFY_TYPES.includes(verify.verify_type),
        ),
      );
      if (hasChtAuth) {
        return {
          isFailed: true,
          error: toastStatus.encryptionChtAuthConflict,
        };
      }
    }

    // NOTE: Refactor, combine user when non-order
    // NOTE: Deduplicate signers by key, reviewers follow their preceding signer's fate.
    let newAssignes = [...assignes];
    if (!has_order) {
      const seenKeys = new Set();
      let isCurrentSignerKept = false;

      newAssignes = assignes.reduce((acc, ass) => {
        if (ass.action === STAGE_ACTION.sign) {
          isCurrentSignerKept = !seenKeys.has(ass[key]);
          if (isCurrentSignerKept) {
            seenKeys.add(ass[key]);
            acc.push(ass);
          }
        } else if (isCurrentSignerKept) {
          acc.push(ass);
        }
        return acc;
      }, []);
    }

    // NOTE: create a mapping object to store the old UIDs and their corresponding new UIDs
    const uidMapping = {};
    assignes.forEach((assigne) => {
      const newAssigne = newAssignes.find((assi) => assi[key] === assigne[key]);
      if (newAssigne) {
        uidMapping[assigne.uid] = newAssigne.uid;
      }
    });

    let newAttachments = [];
    if (attachments) {
      newAttachments = attachments.map((attachment) => {
        return {
          ...attachment,
          signer: {
            ...attachment.signer,
            uid: uidMapping[attachment.signer.uid] || attachment.signer.uid,
          },
        };
      });
    }

    const verifyMethodFormatter = (verify) => {
      const { verify_type, verify_source } = verify;
      if (verify_type === "cht_system") {
        return {
          ...verify,
          verify_source: verify_source?.id,
        };
      } else {
        return verify;
      }
    };
    if (hasWarning(assigneesWarnings)) {
      return {
        isFailed: true,
        error: toastStatus.verifyInvalid,
      };
    }

    let vpDataMap = {};
    // NOTE: envelope vpDataMap
    if (is_envelope) {
      for (const f of file_list) {
        const { file_url, file, envelope_file_id } = f;

        let url;
        if (file_url) {
          url = file_url;
        } else if (file) {
          url = URL.createObjectURL(file);
        }

        const doc = yield call(getDoc, url);
        const vpData = yield call(getAllViewport, doc);
        if (!vpData) {
          throw new Error(
            `Viewport data not found for envelope_file_id: ${envelope_file_id}`,
          );
        }
        const { viewport, rotates } = vpData;
        vpDataMap[envelope_file_id] = { viewport, rotates };

        if (!file_url && file) {
          URL.revokeObjectURL(url);
        }
      }
    }

    // NOTE: Refactor, stages
    let attIdsVisible = newAttachments
      .filter((att) => att.viewable_in_processing)
      .map((att) => att.attachment_id);

    const filteredStages = newAssignes.map((assigne) => {
      let newStage = {
        action: assigne.action,
        [key]: assigne[key],
      };

      // NOTE: for reviewers
      if (assigne.action === STAGE_ACTION.review) {
        if (assigne.name) {
          newStage.name = assigne.name;
        }
        if (assigne.action) {
          newStage.action = assigne.action;
        }
        return newStage;
      }

      // NOTE: for signers
      const attIds = assigne.stage_setting.viewable_in_processing
        ? attIdsVisible
        : [];

      newStage = {
        ...newStage,
        pdf_object_info: [],
        xfdf_info: [],
        attachment_setting: [],
        stage_setting: {
          ...assigne.stage_setting,
          viewable_in_processing_attachments: attIds,
        },
        custom_message_setting: {},
        field_setting_groups: [],
        role: assigne.role || undefined,
      };

      if (assigne.verify) {
        newStage.verify = assigne.verify.map(verifyMethodFormatter);
      }
      if (assigne.name) {
        if (isPublicForm) {
          newStage.role = assigne.name;
        } else {
          newStage.name = assigne.name;
        }
      }

      // NOTE: attachments
      newAttachments.forEach((atta) => {
        const isMatch = has_order
          ? assigne.key === atta.signer.key
          : atta.signer.uid === assigne.uid;

        if (isMatch) {
          newStage.attachment_setting.push({
            attachment_id: atta.attachment_id,
            file_name: atta.file_name,
            force: atta.force,
            viewable_in_processing: atta.viewable_in_processing,
            // NOTE: key transformation (envelope_file_id, task_id) based on envelope state
            ...(isCreatingEnvelope && {
              envelope_file_id: atta.envelope_file_id,
            }),
            ...(isEditingDraftEnvelope && {
              task_id: atta.envelope_file_id,
            }),
          });
        }
      });

      // NOTE: custom_message_setting
      if (msgRequestReceivers && msgCompletedReceivers) {
        const processing_viewable = msgRequestReceivers.some(
          (el) => el.uid === assigne.uid,
        );
        const completed_viewable = msgCompletedReceivers.some(
          (el) => el.uid === assigne.uid,
        );

        newStage.custom_message_setting = {
          processing_viewable,
          completed_viewable,
        };
      }

      // NOTE: one assigne
      let filtered = stages.filter((stage) => {
        if (has_order) {
          return stage.assigne === assigne;
        }
        return stage.assigne[key] === assigne[key];
      });

      // NOTE: has multi columns
      filtered.map((filt) => {
        // NOTE: id
        newStage.pdf_object_info.push(filt.id);

        // NOTE: xfdf
        let xfdfInfoItem = {
          field_type: filt.type,
          object_id: filt.id,
          field_group_object_id: filt.field_group_object_id,
          page: filt.page - 1,
          coord: getPdfCoord(
            filt.coords,
            is_envelope
              ? vpDataMap[filt.envelopeFileId].viewport[filt.page - 1]
              : viewport[filt.page - 1],
            is_envelope
              ? vpDataMap[filt.envelopeFileId].rotates[filt.page - 1]
              : pdfRotates[filt.page - 1],
          ),
          custom_id: filt.custom_id,
          options: filt.options,
        };

        if (filt.is_date) {
          xfdfInfoItem.is_date = true;
        }
        if (filt.style === 0 || filt.style === 1) {
          xfdfInfoItem.style = filt.style;
        }

        // NOTE: key transformation (envelope_file_id, task_id) based on envelope state
        if (isCreatingEnvelope) {
          xfdfInfoItem.envelope_file_id = filt.envelopeFileId;
        } else if (isEditingDraftEnvelope) {
          xfdfInfoItem.task_id = filt.envelopeFileId;
        }

        newStage.xfdf_info.push(xfdfInfoItem);

        // NOTE: field_setting_groups
        const groupId = filt.field_group_object_id;
        if (fieldGroups && groupId) {
          const isExist = newStage.field_setting_groups.find(
            (stg) => stg.field_group_object_id === groupId,
          );
          if (isExist) {
            return;
          }

          const groupItem = fieldGroups.find(
            (group) => group.field_group_object_id === groupId,
          );
          if (!groupItem) {
            return;
          }

          const updatedGroupItem = { ...groupItem };

          // NOTE: key transformation (envelope_file_id, task_id) based on envelope state
          if (isCreatingEnvelope) {
            updatedGroupItem.envelope_file_id = filt.envelopeFileId;
          } else if (isEditingDraftEnvelope) {
            updatedGroupItem.task_id = filt.envelopeFileId;
          }

          newStage.field_setting_groups.push(updatedGroupItem);
        }
      });

      return newStage;
    });

    // NOTE: Check, xfdf
    const signerStages = filterSignerAssignes(filteredStages);
    let isValid = true;
    signerStages.forEach((stage) => {
      if (stage.pdf_object_info.length < 1 || stage.xfdf_info.length < 1) {
        return (isValid = false);
      }
    });
    if (!isValid) {
      return {
        isFailed: true,
        error: toastStatus.assigneFal,
      };
    }

    // NOTE: message
    const isMsgReqError =
      ((message && message.length > 0) ||
        (references && references.length > 0)) &&
      (!msgRequestReceivers || msgRequestReceivers.length < 1);

    const isMsgCompletedError =
      ((completedMessage && completedMessage.length > 0) ||
        (completedReferences && completedReferences.length > 0)) &&
      (!msgCompletedReceivers || msgCompletedReceivers.length < 1);

    if (isMsgReqError || isMsgCompletedError) {
      return {
        isFailed: true,
        error: toastStatus.messageError,
      };
    }

    // NOTE: reference, request
    let reference_setting = [];
    if (references && references.length > 0) {
      references.map((ref) => {
        let refNew = {
          file_name: ref.file.name,
          reference_type: getImageFormat(ref.file.type),
          reference_id: ref.fileId,
        };

        if (ref.is_uploaded) {
          refNew.is_uploaded = true;
        }

        reference_setting.push(refNew);
      });
    }

    // NOTE: reference, completed
    let completed_reference_setting = [];
    if (completedReferences && completedReferences.length > 0) {
      completedReferences.map((ref) => {
        let refNew = {
          file_name: ref.file.name,
          reference_type: getImageFormat(ref.file.type),
          reference_id: ref.fileId,
        };

        if (ref.is_uploaded) {
          refNew.is_uploaded = true;
        }

        completed_reference_setting.push(refNew);
      });
    }

    let toTransfer = {
      has_order: has_order === true ? 1 : 0,
      stages: filteredStages,
      forget_remind,
      deadline,
      expire_remind,
      receiver_lang,
    };

    if (file_name) {
      toTransfer.file_name = file_name;
    }
    if (is_envelope && envelope_name) {
      toTransfer.envelope_name = envelope_name;
    }

    // NOTE: key transformation (envelope_file_id, task_id) based on envelope state
    if (file_list) {
      if (isEditingDraftEnvelope) {
        toTransfer.file_list = file_list.map(
          ({ envelope_file_id, ...rest }) => ({
            ...rest,
            task_id: envelope_file_id,
          }),
        );
      } else if (isCreatingEnvelope) {
        toTransfer.file_list = file_list;
      }
    }

    if (templateCode) {
      toTransfer.code = templateCode;
    }

    if (typeof is_encrypted === "boolean") {
      toTransfer.is_encrypted = is_encrypted;
      toTransfer.completion_password = completion_password;
    }

    if (typeof message === "string") {
      toTransfer.message = message;
    }

    if (ccInfos) {
      toTransfer.cc_info = ccInfos;
    }

    if (typeof completedMessage === "string") {
      toTransfer.completed_message = completedMessage;
    }

    if (reference_setting) {
      toTransfer.reference_setting = reference_setting;
    }

    if (completed_reference_setting) {
      toTransfer.completed_reference_setting = completed_reference_setting;
    }

    if (expire_remind) {
      toTransfer.remind_days_before_expire = remind_days_before_expire;
    }
    if (labels) {
      toTransfer.tags = labels;
    }

    if (isReplaceTemplate) {
      yield put({ type: commonActions.CLOSE_MODAL });
      toTransfer.is_replace_template = isReplaceTemplate;
    }

    return toTransfer;
  } catch (err) {
    console.log(err);
  }
}

// NOTE: create + upload
function* createDraft({ isTemplate, data }) {
  try {
    const isEnvelope = data.is_envelope;
    const getCreateInfo = (state) => state.create;
    const { templateId } = yield select(getCreateInfo);
    let toTransfer = yield call(prepareDraftData, { isTemplate, data });
    if (toTransfer.isFailed) {
      isTemplate
        ? yield put({ type: createActions.POST_TEMPLATE_FAL })
        : yield put({ type: createActions.POST_DRAFT_FAL });

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toTransfer.error,
      });

      return false;
    }

    // NOTE: create draft
    let resp;
    if (isEnvelope) {
      resp = yield call(createApi.postEnvelopeDraft, toTransfer);
    } else if (isTemplate) {
      resp = yield call(createApi.postTemplate, toTransfer);
    } else {
      resp = yield call(createApi.postDraft, toTransfer);
    }

    if (isTemplate && resp.error_code && resp.error_message) {
      if (resp.error_code === 400080) {
        yield put({ type: createActions.POST_TEMPLATE_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.duplicateTemplateCode,
        });
      } else {
        yield put({ type: createActions.POST_TEMPLATE_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postTemplateFal,
        });
      }

      return false;
    }

    if (!isTemplate && resp.error_code && resp.error_message) {
      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.emailFormatError,
        });
      } else {
        yield put({ type: createActions.POST_DRAFT_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postDraftFal,
          toastId: "ReviewSend-Send-Failed-Createtask-GetSignatures",
        });
      }

      return false;
    }

    // NOTE: renew contact list
    yield put({ type: memberActions.GET_CONTACTS });

    // NOTE: create task or replace document in template, need to upload file
    let uploadFileResResults = [];
    if (isEnvelope) {
      uploadFileResResults = yield all(
        resp.data.task_infos.map((info) => {
          const fileData = data.file_list.find(
            (file) => file.envelope_file_id === info.envelope_file_id,
          );
          return call(uploadFile, info.upload_link, fileData.file);
        }),
      );
    } else if (data.files.length > 0) {
      const uploadFileResResult = yield call(
        uploadFile,
        resp.data.upload_link,
        data.files[0],
      );
      uploadFileResResults = [uploadFileResResult];
    }

    if (uploadFileResResults.some((result) => result.errorCode)) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.uploadFailed,
      });
      return false;
    }

    // NOTE: upload reference files
    if (data.references && data.references.length > 0) {
      data.references.forEach((el, i) => {
        let formData = new FormData();
        formData.append("file", el.file);
        fetch(resp.data.reference_upload_links[i].upload_link, {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      });
    }

    if (data.completedReferences && data.completedReferences.length > 0) {
      data.completedReferences.forEach((el, i) => {
        let formData = new FormData();
        formData.append("file", el.file);
        fetch(resp.data.completed_reference_upload_links[i].upload_link, {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      });
    }

    // NOTE: replace document (抽換底稿)
    const isReplaceDocument = templateId && data.files.length > 0;

    // NOTE: src: determine if a timeout or a normal socket resp
    if (templateId && !isReplaceDocument) {
      // NOTE: reuse template pdf document
      const respFileShare = yield call(createApi.postTemplateFileShare, {
        template_id: templateId,
        sign_task_id: resp.data.task_id,
      });

      if (respFileShare.error_code) {
        if (respFileShare.error_code === 403044) {
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.templateNotAccessible,
          });
        }
        return false;
      }

      return { taskId: resp.data.task_id };
    } else {
      if (isTemplate) {
        const respTemplate = yield call(
          createApi.getTemplate,
          resp.data.template_id,
        );
        if (respTemplate.error_code) {
          yield call(postTemplateFal);
          return null;
        }
        return respTemplate;
      } else {
        return isEnvelope
          ? {
              envelopeId: resp.data.envelope_id,
            }
          : { taskId: resp.data.task_id };
      }
    }
  } catch (err) {
    console.log(err);
    isTemplate
      ? yield put({ type: createActions.POST_TEMPLATE_FAL })
      : yield put({ type: createActions.POST_DRAFT_FAL });

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonDraftError,
    });

    return false;
  }
}
// NOTE: start
function* startDraft(payload) {
  try {
    const { envelope_id, task_id, src } = payload;
    const params = envelope_id
      ? { envelope_id, src }
      : { sign_task_id: task_id, src };

    const resp2 = yield call(
      envelope_id ? createApi.postEnvelopeDraftStart : createApi.postDraftStart,
      params,
    );
    if (resp2.error_code && resp2.error_message) {
      // NOTE: Error 3. create error
      yield put({ type: createActions.POST_CREATE_FAL });

      if (
        resp2.error_code === 4013 &&
        resp2.error_message === "over monthly task usage"
      ) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.overLimit,
        });
        yield delay(4000);
        yield put({ type: commonActions.CLOSE_MODAL });
        yield call(Router.push, "/tasks");
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postCreateFal,
        });
      }

      return false;
    }

    return true;
  } catch (err) {
    yield put({ type: createActions.POST_CREATE_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonDraftError,
    });

    return false;
  }
}
// NOTE: put
function* modifyDraft({ data, isTemplate }) {
  try {
    const toTransfer = yield call(prepareDraftData, { data, isTemplate });

    if (toTransfer.isFailed) {
      isTemplate
        ? yield put({ type: createActions.PUT_TEMPLATE_FAL })
        : yield put({ type: createActions.PUT_DRAFT_FAL });

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toTransfer.error,
      });

      return false;
    }

    let resp;
    if (data.is_envelope) {
      resp = yield call(createApi.putEnvelopeDraft, {
        ...toTransfer,
        envelopeId: data.envelopeId,
      });
    } else if (isTemplate) {
      resp = yield call(createApi.putTemplate, {
        ...toTransfer,
        templateId: data.templateId,
      });
    } else {
      resp = yield call(createApi.putDraft, {
        ...toTransfer,
        taskId: data.taskId,
      });
    }

    if (resp.error_code && resp.error_message) {
      if (!isTemplate) {
        yield put({ type: createActions.PUT_DRAFT_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putDraftFal,
        });
        return false;
      }

      // NOTE: handle template error
      if (resp.error_code === 400080) {
        yield put({ type: createActions.PUT_TEMPLATE_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.duplicateTemplateCode,
        });
      } else {
        yield put({ type: createActions.PUT_TEMPLATE_FAL });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.putTemplateFal,
        });
      }
      return false;
    }

    // NOTE: upload reference files
    if (
      data.references &&
      data.references.length > 0 &&
      resp.data.reference_upload_links
    ) {
      data.references.forEach((el) => {
        if (el.is_uploaded) {
          return;
        }

        const matchedRef = resp.data.reference_upload_links.find(
          (ref) => ref.reference_id === el.fileId,
        );
        if (!matchedRef) {
          console.error(`No upload link found for reference_id: ${el.fileId}`);
          return;
        }

        let formData = new FormData();
        formData.append("file", el.file);
        fetch(matchedRef.upload_link, {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      });
    }

    if (
      data.completedReferences &&
      data.completedReferences.length > 0 &&
      resp.data.completed_reference_upload_links
    ) {
      data.completedReferences.forEach((el) => {
        if (el.is_uploaded) {
          return;
        }

        const matchedRef = resp.data.completed_reference_upload_links.find(
          (ref) => ref.reference_id === el.fileId,
        );
        if (!matchedRef) {
          console.error(`No upload link found for reference_id: ${el.fileId}`);
          return;
        }

        let formData = new FormData();
        formData.append("file", el.file);
        fetch(matchedRef.upload_link, {
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      });
    }

    return resp;
  } catch (err) {
    if (isTemplate) {
      yield put({ type: createActions.PUT_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putTemplateFal,
      });
    } else {
      yield put({ type: createActions.PUT_DRAFT_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonDraftError,
      });
    }

    return false;
  }
}

// NOTE: others
function* revertDraft({ data }) {
  try {
    const {
      task_id,
      has_order,
      file_name,
      download_link,
      stage_infos,
      tag_info,
      image_info,

      forget_remind,
      need_otp_verify,
      deadline,
      expire_remind,
      remind_days_before_expire,
      receiver_lang,
      message,
      completed_message,
      reference_setting,
      completed_reference_setting,
      cc_info: ccInfos,

      envelope_id,
      envelope_name,
      task_infos: file_list,
    } = data;

    const isEnvelope = !!envelope_id;

    const verifyMethodParser = (verify) => {
      const { verify_type, verify_source } = verify;
      if (verify_type === "cht_system") {
        return {
          ...verify,
          verify_source: {
            id: parseInt(verify_source),
          },
        };
      } else {
        return verify;
      }
    };

    // NOTE: assignes, msgReceivers
    let msgRequestReceivers = [];
    let msgCompletedReceivers = [];
    let stageIdUidMap = {}; // NOTE: reviewer → base signer

    const assigneesUnchecked = stage_infos.map((stage, idx) => {
      const stage_setting = (() => {
        if (stage.action === STAGE_ACTION.review) {
          return null;
        }

        const {
          forward_enable = false,
          decline_enable = true,
          viewable_in_processing = true,
          viewable_in_completed = true,
          reviewed_skip_confirm = true,
        } = stage?.full_info?.stage_setting || {};

        return {
          forward_enable,
          decline_enable,
          viewable_in_processing,
          viewable_in_completed,
          reviewed_skip_confirm,
        };
      })();

      const signer = {
        action: stage.action,
        email: stage.email,
        key: idx,
        label: stage.name,
        name: stage.name,
        uid: `user-${uuid()}`,
        stage_setting,
        verify: stage?.full_info?.verify_methods?.map(verifyMethodParser),
        isMe: stage.name === "Me",
        actor_info: stage.actor_info,
      };

      if (stage.action === STAGE_ACTION.sign) {
        stageIdUidMap[stage.stage_id] = signer.uid;
      }
      if (stage.action === STAGE_ACTION.review) {
        signer.actor_info = {
          ...signer.actor_info,
          base_uid: stageIdUidMap[stage.actor_info.base_stage_id],
        };
      }

      return signer;
    });

    const assignes = yield call(reloadSystemCAs, {
      assignees: assigneesUnchecked,
      assigneeNeedsToReload: isUsingSystemCA,
    });
    const assigneesWarnings = getAssigneesWarnings(assignes);

    stage_infos.forEach((stage) => {
      const { custom_message_setting } = stage.full_info;
      const signer = assignes.find((el) => el.email === stage.email);

      if (!custom_message_setting) {
        return;
      }
      if (
        ((message && message.length > 0) ||
          (reference_setting && reference_setting.length > 0)) &&
        custom_message_setting.processing_viewable
      ) {
        msgRequestReceivers.push(signer);
      }

      if (
        ((completed_message && completed_message.length > 0) ||
          (completed_reference_setting &&
            completed_reference_setting.length > 0)) &&
        custom_message_setting.completed_viewable
      ) {
        msgCompletedReceivers.push(signer);
      }
    });

    // NOTE: attachments
    let attachments = [];

    if (isEnvelope) {
      stage_infos.map((usr, idx) => {
        const signer = assignes[idx];

        usr.full_info.envelope_task_infos.map((envTskInfo) => {
          const envelope_file_id = envTskInfo.task_id;
          if (
            envTskInfo.attachment_setting &&
            envTskInfo.attachment_setting.length > 0
          ) {
            envTskInfo.attachment_setting.map((att) => {
              attachments.push({
                ...att,
                uuid: uuid(),
                signer,
                envelope_file_id,
              });
            });
          }
        });
      });
    } else {
      stage_infos.map((usr, idx) => {
        const signer = assignes[idx];

        if (
          usr.full_info.attachment_setting &&
          usr.full_info.attachment_setting.length > 0
        ) {
          usr.full_info.attachment_setting.map((att) => {
            attachments.push({
              ...att,
              uuid: uuid(),
              signer,
            });
          });
        }
      });
    }

    // NOTE: references
    let references;
    let completed_references;

    const parseReference = (target) => {
      if (!target) {
        return [];
      }

      return target.map((ref) => ({
        fileId: ref.reference_id,
        file: {
          name: ref.file_name,
          type: ref.reference_type || ref.type,
        },
        is_uploaded: true,
      }));
    };

    if (reference_setting) {
      references = parseReference(reference_setting);
    }

    if (completed_reference_setting) {
      completed_references = parseReference(completed_reference_setting);
    }

    // NOTE: stages
    let stages = [];
    let fieldGroups = [];

    if (isEnvelope) {
      // NOTE: get vpDataMap
      let vpDataMap = {};
      for (const f of file_list) {
        const { download_link, task_id } = f;
        const doc = yield call(getDoc, download_link);
        const vpData = yield call(getAllViewport, doc);

        if (!vpData) {
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.revertDraftFal,
          });
          yield delay(5000);
          yield call(Router.push, "/tasks");
          throw new Error(`Viewport data not found for task_id: ${task_id}`);
        }

        const { viewport, rotates } = vpData;
        vpDataMap[task_id] = { viewport, rotates };
      }

      stage_infos.map((usr, idx) => {
        usr.full_info.envelope_task_infos.map((envTskInfo) => {
          const isGroupReadOnly = (groupId) =>
            (envTskInfo.field_setting_groups || []).some(
              (g) =>
                g.field_group_object_id === groupId && g.options?.read_only,
            );

          let xfdf = xfdf2Obj(envTskInfo.xfdf_text);

          xfdf.forEach((stage) => {
            // NOTE: get setting
            const setting = envTskInfo?.field_settings?.find(
              (itm) => itm.field_object_id === stage.id,
            );

            // NOTE: coords should revert to 0 degree based
            const coordOri = stage.coord.map((cor) => parseInt(cor));
            const coordNew = getMyCoord(
              coordOri,
              vpDataMap[envTskInfo.task_id].viewport[stage.page - 1],
              vpDataMap[envTskInfo.task_id].rotates[stage.page - 1],
            );

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
                fieldType = setting.field_type;
              } else if (setting?.field_type === fieldTypes.image) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_image";
                img = setting.field_value
                  ? image_info?.images?.find(
                      (info) => info.id === parseInt(setting.field_value),
                    )?.raw || null
                  : null;
              } else if (setting?.field_type === fieldTypes.link) {
                fieldType = setting.field_type;
                defaultPlaceholder = "input_link";
              } else if (setting?.field_type === fieldTypes.systemTime) {
                fieldType = setting.field_type;
                defaultPlaceholder = systemTimeI18Keys[setting.options.format];
              } else {
                fieldType = setting.field_type;
              }
            }

            let tempStage = {
              assigne: assignes[idx],
              coords: coordNew,
              id: stage.id,
              page: stage.page,
              text: defaultPlaceholder,
              type: fieldType,
              ...(img ? { img } : {}),
            };

            if (setting?.field_type === fieldTypes.date) {
              tempStage.is_date = stage.is_date;
            }
            if (stage.style === 0 || stage.style === 1) {
              tempStage.style = stage.style;
            }

            if (setting?.custom_id) {
              tempStage.custom_id = setting.custom_id;
            }

            if (setting?.field_group_object_id) {
              tempStage.field_group_object_id = setting.field_group_object_id;
            }

            tempStage.options = setting?.options;

            if (isGroupReadOnly(tempStage.field_group_object_id)) {
              tempStage.options = {
                ...(tempStage.options || {}),
                read_only: true,
              };
            }

            if (envTskInfo.pdf_object_info.some((id) => id === stage.id)) {
              tempStage.envelopeFileId = envTskInfo.task_id;
            }

            stages.push(tempStage);
          });
          // NOTE: fieldGroups
          envTskInfo.field_setting_groups?.map((g) => {
            fieldGroups.push(g);
          });
        });
      });
    } else {
      const doc = yield call(getDoc, download_link);
      const vpData = yield call(getAllViewport, doc);

      if (!vpData) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.revertDraftFal,
        });
        yield delay(5000);
        yield call(Router.push, "/tasks");
        return;
      }

      const { viewport, rotates } = vpData;

      stage_infos.map((usr, idx) => {
        if (usr.action === STAGE_ACTION.review) {
          return;
        }

        const isGroupReadOnly = (groupId) =>
          (usr.full_info.field_setting_groups || []).some(
            (g) => g.field_group_object_id === groupId && g.options?.read_only,
          );

        let xfdf = xfdf2Obj(usr.full_info.xfdf_text);

        xfdf.forEach((stage) => {
          // NOTE: get setting
          const setting = usr?.full_info?.field_settings?.find(
            (itm) => itm.field_object_id === stage.id,
          );

          // NOTE: coords should revert to 0 degree based
          const coordOri = stage.coord.map((cor) => parseInt(cor));
          const coordNew = getMyCoord(
            coordOri,
            viewport[stage.page - 1],
            rotates[stage.page - 1],
          );

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
              fieldType = setting.field_type;
            } else if (setting?.field_type === fieldTypes.image) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_image";
              img = setting.field_value
                ? image_info?.images?.find(
                    (info) => info.id === parseInt(setting.field_value),
                  )?.raw || null
                : null;
            } else if (setting?.field_type === fieldTypes.link) {
              fieldType = setting.field_type;
              defaultPlaceholder = "input_link";
            } else if (setting?.field_type === fieldTypes.systemTime) {
              fieldType = setting.field_type;
              defaultPlaceholder = systemTimeI18Keys[setting.options.format];
            } else {
              fieldType = setting.field_type;
            }
          }

          let tempStage = {
            assigne: assignes[idx],
            coords: coordNew,
            id: stage.id,
            page: stage.page,
            text: defaultPlaceholder,
            type: fieldType,
            ...(img ? { img } : {}),
          };

          if (setting?.field_type === fieldTypes.date) {
            tempStage.is_date = stage.is_date;
          }
          if (stage.style === 0 || stage.style === 1) {
            tempStage.style = stage.style;
          }

          if (setting?.custom_id) {
            tempStage.custom_id = setting.custom_id;
          }

          if (setting?.field_group_object_id) {
            tempStage.field_group_object_id = setting.field_group_object_id;
          }

          tempStage.options = setting?.options;

          if (isGroupReadOnly(tempStage.field_group_object_id)) {
            tempStage.options = {
              ...(tempStage.options || {}),
              read_only: true,
            };
          }

          stages.push(tempStage);
        });

        // NOTE: fieldGroups
        usr.full_info.field_setting_groups?.map((g) => {
          fieldGroups.push(g);
        });
      });
    }

    // NOTE: labels
    let labels = [];
    Object.keys(tag_info).forEach((key) => {
      if (tag_info[key]) {
        labels.push(key);
      }
    });

    const draftData = {
      taskId: task_id,
      envelopeId: envelope_id,
      fileUrl: isEnvelope ? file_list[0].download_link : download_link,
      envelopeName: envelope_name,
      fileName: file_name,
      isOrder: has_order,
      assignes,
      assigneesWarnings,
      stages,
      fieldGroups,
      labels,

      forget_remind,
      need_otp_verify,
      expire_remind,
      remind_days_before_expire: expire_remind ? remind_days_before_expire : 0,
      receiver_lang,
      message,
      completedMessage: completed_message,
      attachments,
      reference_setting,
      completed_reference_setting,
      msgRequestReceivers,
      msgCompletedReceivers,
      is_encrypted: data.is_encrypted,
      completion_password: data.completion_password,
    };

    if (deadline) {
      draftData.deadline = unixToString(deadline, "yyyy/mm/dd", false);
    }

    if (ccInfos) {
      draftData.ccInfos = ccInfos;
    }

    if (references) {
      draftData.references = references;
    }
    if (completed_references) {
      draftData.completedReferences = completed_references;
    }

    if (isEnvelope) {
      const results = yield all(
        file_list.map((file) =>
          call(fetchFileData, {
            file,
            isRevertDraft: true,
          }),
        ),
      );

      draftData.fileList = results;

      draftData.fileFocus = results[0];
    }

    if (ccInfos) {
      draftData.ccInfos = ccInfos;
    }

    yield put({
      type: createActions.REVERT_DRAFT_SUC,
      payload: draftData,
    });
    return;
  } catch (err) {
    console.log(err);
    yield call(Router.push, "/tasks");
    yield delay(2000);
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.revertDraftFal,
    });
  }
}

function* postSignAndSend({ data }) {
  try {
    const getPdf = (state) => state.pdf;
    const { viewport, pdfRotates } = yield select(getPdf);

    const { file_name, files, stages } = data;

    let pdf_object_info = [];
    let xfdf_info = [];
    let sign_info = [];

    if (!stages || (stages && stages.length < 1)) {
      yield put({ type: createActions.POST_SIGN_AND_SEND_FAL });

      return yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.noFields,
      });
    }

    const getValue = (stage) => {
      if (stage.type === fieldTypes.sign) {
        return stage.signid;
      } else if (stage.type === fieldTypes.image) {
        return stage.image_id;
      } else {
        return stage.raw;
      }
    };

    stages.map((stage) => {
      pdf_object_info.push(stage.id);
      sign_info.push({
        object_id: stage.id,
        type: stage.type,
        value: getValue(stage),
        style: stage.style,
      });
      xfdf_info.push({
        field_type: stage.type,
        object_id: stage.id,
        page: stage.page - 1,
        is_date: stage.isDate,
        style: stage.style,
        coord: getPdfCoord(
          stage.coords,
          viewport[stage.page - 1],
          pdfRotates[stage.page - 1],
        ),
        options: stage.options,
      });
    });

    let toTransfer = {
      file_name,
      pdf_object_info,
      xfdf_info,
      sign_info,
    };

    const resp = yield call(createApi.postSignAndSend, toTransfer);
    if (resp.error_code && resp.error_message) {
      yield put({ type: createActions.POST_SIGN_AND_SEND_FAL });
      if (resp.error_code === 404030) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.signatureNotFound,
        });
      } else {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.postSignAndSendFal,
          toastId: "Assign-FieldsSend-Failed-Createtask-SignYourself",
        });
      }
    } else {
      // NOTE: upload file
      let formData = new FormData();
      formData.append("file", files[0]);

      fetch(resp.data.upload_link, {
        method: "POST",
        header: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }).then(() => console.log("ok"));
    }

    const { payload } = yield race({
      payload: call(genStateChange, { key: "taskStatusChanged" }),
      timeout: delay(300000),
    });

    if (!payload) {
      const respTask = yield call(signApi.getSignTask, {
        taskId: resp.data.task_id,
      });
      if (respTask.error_code) {
        yield call(postSignAndSendFal);
        return null;
      }
    }

    yield put({ type: createActions.POST_SIGN_AND_SEND_SUC });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postSignAndSendSuc,
      toastId: "Edit-Field-Send-Suc-SignYourself",
    });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield take(commonActions.CLOSE_TOAST);
    yield call(Router.push, `/task?taskId=${resp.data.task_id}`);
  } catch (err) {
    console.log(err);
    yield call(postSignAndSendFal);
  }
}

function* setAttachments({ data }) {
  try {
    const { attachments, isModal } = data;
    const getCreate = (state) => state.create;
    const { assignes } = yield select(getCreate);

    if (assignes) {
      let isValid = true;

      if (isValid) {
        yield put({
          type: createActions.SET_ATTACHMENTS_SUC,
          payload: attachments,
        });

        if (isModal) {
          yield put({ type: commonActions.CLOSE_MODAL });
        }
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.overLimitAttachment,
      });
      return;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  } catch (err) {
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* setBulkList({ data }) {
  try {
    const { file, csvBlank } = data;

    if (!file || !csvBlank) {
      yield put({ type: createActions.SET_BULK_LIST_FAL, payload: null });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    }

    const getCreate = (state) => state.create;
    const { fileName } = yield select(getCreate);

    const oriObj = yield call(readCsv, csvBlank);

    const encoder = yield call(getEncoding, file);
    const myObj = yield call(readCsv, file, encoder.encoding);

    const header = oriObj[0].filter((val) => val !== "");
    const headerFile = myObj[0].filter((val) => val !== "");

    // NOTE: check header
    let isHeaderMismatch = false;
    if (header.length !== headerFile.length) {
      isHeaderMismatch = true;
    } else {
      headerFile.map((val, idx) => {
        if (val !== header[idx]) {
          isHeaderMismatch = true;
        }
      });
    }

    if (isHeaderMismatch) {
      yield put({
        type: createActions.SET_BULK_LIST_FAL,
        payload: {
          errors: null,
          length: null,
        },
      });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.wrongCsvFile,
      });
      return;
    }

    // NOTE: check content
    let bulkList = [];
    let bulkError = [];
    let bulkLength = 0;
    myObj.map((itm, order) => {
      if (order === 0) {
        return;
      }

      let validCount = 0;
      let itmValid = itm.filter((_, idx) => idx < header.length);

      // NOTE: all null row
      const arrNullIdx = itm.reduce((a, e, i) => {
        if (e === "") {
          a.push(i);
        }
        return a;
      }, []);
      if (arrNullIdx.length === itm.length) {
        return;
      }

      // NOTE: valid row
      itmValid.map((val, idx) => {
        // NOTE: nullable cont
        if (idx === 0 || idx === 1) {
          if (idx === 0 && (val === null || val === "")) {
            itmValid[header[0]] = fileName;
          }

          validCount += 1;
          return;
        }

        if (val !== "" && val !== null) {
          if (header[idx].indexOf(".email") > -1 && !isEmail(val)) {
            return;
          }

          validCount += 1;
          return;
        }
      });

      // NOTE: null row, skip
      if (validCount < 3) {
        return;
      }

      // NOTE: valid row
      bulkLength += 1;

      // NOTE: save row
      let copy = {};
      header.map((key, idx) => (copy[key] = itmValid[idx]));

      if (validCount < header.length) {
        bulkError.push(copy);
      } else {
        bulkList.push(copy);
      }
    });

    if (bulkLength > 100) {
      yield put({
        type: createActions.SET_BULK_LIST_FAL,
        payload: {
          errors: null,
          length: null,
        },
      });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.csvOverLimit,
      });
      return;
    }

    if (bulkError.length > 0) {
      yield put({
        type: createActions.SET_BULK_LIST_FAL,
        payload: {
          errors: [header, ...bulkError],
          length: bulkLength,
        },
      });
      return;
    }

    yield put({
      type: createActions.SET_BULK_LIST_SUC,
      payload: bulkList,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: createActions.SET_BULK_LIST_FAL,
      payload: {
        errors: null,
        length: null,
      },
    });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* postBulk() {
  try {
    const getCreate = (state) => state.create;
    const getTemplate = (state) => state.template;

    const { isBulk, templateId, bulkList, bulkError } = yield select(getCreate);
    const { templates } = yield select(getTemplate);
    const targetTemplate = templates.find(
      ({ template_id }) => template_id === templateId,
    );
    if (!isBulk || !targetTemplate) {
      yield put({ type: createActions.POST_BULK_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    if (bulkError || !bulkList || bulkList.length < 1) {
      yield put({ type: createActions.POST_BULK_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.wrongCsvContent,
      });
      return;
    }

    let tasks = [];
    bulkList.forEach((itm) => {
      const stages = [];
      Object.keys(itm).forEach((key) => {
        if (key.indexOf("signer") === -1) {
          return;
        }

        const order = parseInt(key.split(".")[0].substring(6)) - 1;
        const attr = key.split(".")[1];

        if (!stages[order]) {
          stages[order] = {
            role: targetTemplate.detail[order].role,
          };
        }
        stages[order][attr] = itm[key];
      });

      tasks.push({
        file_name: itm["document.title"],
        message: itm["custom.message"],
        stages,
      });
    });

    const toTransfer = {
      template_id: templateId,
      tasks,
    };

    const resp = yield call(createApi.postBulk, toTransfer);
    if (resp.error_code) {
      yield put({ type: createActions.POST_BULK_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.postBulkFal,
      });
      return;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.postBulkSuc,
    });
    yield delay(4000);
    yield put({ type: createActions.POST_BULK_SUC });
    yield call(Router.push, "/settings/bulk-send");
  } catch (error) {
    console.log(error);
    yield put({ type: createActions.POST_BULK_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* resetCreate() {
  try {
    yield put({ type: RESET_PDF });
    yield put({ type: RESET_PREVIEW });
  } catch (err) {
    console.log(err);
  }
}

const readCsv = (file, encoding) => {
  return new Promise((resolve) => {
    parse(file, {
      encoding: encoding || "UTF-8",
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

const getEncoding = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let csvResult = e.target.result.split(/\r|\n|\r\n/);
      resolve(jschardet.detect(csvResult.toString()));
    };
    reader.readAsBinaryString(file);
  });
};

function* postFrontDesk() {
  yield put({ type: commonActions.CLOSE_MODAL });
  yield put({ type: createActions.POST_FRONT_DESK_SUC });
}

function* postPublicForm({ data }) {
  const { dataTrans, isPublish } = data;
  try {
    const getCreate = (state) => state.create;
    const {
      isOrder,
      fileName,
      description,
      assignes,
      stopByDeadline,
      stopDeadline,
      stopByResponseCount,
      responseCount,
      labels,
    } = yield select(getCreate);

    const toTransfer = yield call(prepareDraftData, { data: dataTrans });

    if (toTransfer.isFailed) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toTransfer.error,
      });
      return;
    }

    if (!isOrder) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.publicFormTemplateError,
      });
      return;
    }

    let isBlank = false;
    let isMailInvalid = false;
    let isPhoneInvalid = false;
    let isNationalIdInvalid = false;
    let isSignerOrderInvalid = (() => {
      let foundNormalSigner = false;
      for (let i = 0; i < assignes.length; i++) {
        if (assignes[i].signer_type !== "form_signer") {
          foundNormalSigner = true;
        }
        if (foundNormalSigner && assignes[i].signer_type === "form_signer") {
          return true;
        }
      }
      return false;
    })();

    assignes.map((signer) => {
      if (signer.signer_type === "form_signer") {
        return;
      }

      if (
        !signer.email ||
        signer.email.length < 1 ||
        !signer.name ||
        signer.name.length < 1
      ) {
        isBlank = true;
        return;
      }

      if (!isEmail(signer.email)) {
        isMailInvalid = true;
        return;
      }

      if (signer.verify?.length > 0) {
        const smsItm = signer.verify.find((itm) => itm.verify_type === "sms");

        if (smsItm && !isPhone(smsItm.verify_source)) {
          isPhoneInvalid = true;
          return;
        }
      }
    });

    if (isBlank) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.publicFormCheckFal,
      });
      return;
    }

    if (isMailInvalid) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.notEmail,
      });
      return;
    }

    if (isPhoneInvalid) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.phoneRequired,
      });
      return;
    }

    if (isSignerOrderInvalid) {
      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.publicFormSignerOrderError,
      });
      return;
    }

    if (isNationalIdInvalid) {
      yield put({ type: createActions.CHECK_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.nationalIdRequired,
      });
      return;
    }

    const signer_infos = assignes.map((signer) => {
      if (signer.signer_type === "form_signer") {
        return {
          signer_type: "form_signer",
          requisite: signer.requisite,
        };
      }

      if (signer.verify?.length > 0) {
        const smsItm = signer.verify.find((itm) => itm.verify_type === "sms");

        if (smsItm) {
          return {
            signer_type: "normal_signer",
            name: signer.name,
            email: signer.email,
            phone: smsItm.verify_source,
          };
        }
      }

      return {
        signer_type: "normal_signer",
        name: signer.name,
        email: signer.email,
      };
    });

    const data = {
      form_name: fileName,
      description: description || "",
      signer_infos,
      stages: toTransfer.stages,
      tags: labels,
      end_at: stopByDeadline ? localDatetimeToUnix(stopDeadline) : -1,
      goal_num: stopByResponseCount ? responseCount : -1,
      status: isPublish ? "publish" : "unpublish",
    };

    if (typeof toTransfer.receiver_lang !== "undefined") {
      data.receiver_lang = toTransfer.receiver_lang;
    }

    if (typeof toTransfer.cc_info !== "undefined") {
      data.cc_info = toTransfer.cc_info;
    }

    const resp = yield call(createApi.postPublicForm, data);

    if (resp.error_code) {
      let errorType;
      switch (resp.error_code) {
        case 403058:
          errorType = toastStatus.overLimitPublicForm;
          break;
        case 400914:
          errorType = toastStatus.publicFormCheckerNotSupport;
          break;
        case 400220:
          errorType = toastStatus.emailFormatError;
          break;
        case 400938:
          errorType = toastStatus.templateInvalidWithEditor;
          break;
        default:
          errorType = toastStatus.postPublicFormFal;
          break;
      }

      yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: errorType,
      });
      return;
    }

    // NOTE: upload files
    let uploadFileResResults = [];
    if (dataTrans.files.length > 0) {
      const uploadFileResResult = yield call(
        uploadFile,
        resp.data.form_info.upload_link,
        dataTrans.files[0],
      );
      uploadFileResResults = [uploadFileResResult];
    }

    if (uploadFileResResults.some((result) => result.errorCode)) {
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.uploadFailed,
      });
      return false;
    }

    yield put({
      type: commonActions.OPEN_TOAST,
      payload: isPublish
        ? toastStatus.postPublicFormSuc
        : toastStatus.savePublicFormSuc,
    });

    yield delay(5000);
    yield put({ type: createActions.POST_PUBLIC_FORM_SUC });
    yield put({ type: commonActions.CLOSE_MODAL });
    yield call(Router.push, "/public-forms");
    yield delay(500);
    yield put({ type: createActions.RESET_CREATE });
  } catch (err) {
    console.log(err);
    yield put({ type: createActions.POST_PUBLIC_FORM_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* getPublicForm({ data }) {
  try {
    const { formId } = data;
    const resp = yield call(createApi.getPublicForm, formId);

    if (resp.error_code) {
      yield put({ type: createActions.GET_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.getPublicFormFal,
      });
      yield delay(5000);
      yield call(Router.push, "/public-forms");
      return;
    }

    const { form_info } = resp.data;

    // NOTE: assignes
    const parseVerifyMethods = (detail, signerInfo) => {
      if (!detail) {
        return [];
      }

      const methods = detail.verify_methods || detail.verify || [];

      return methods.map((method) => {
        if (method.verify_type === "cht_system") {
          const source = method.verify_source;
          if (typeof source === "object" && source !== null) {
            return method;
          }

          return {
            ...method,
            verify_source: { id: parseInt(source, 10) },
          };
        }

        if (method.verify_type === "sms") {
          return {
            ...method,
            verify_source: signerInfo.phone || method.verify_source,
          };
        }

        return method;
      });
    };

    const assignes = resp.data.signer_infos.map((signer, idx) => {
      const usr = form_info.detail[idx];
      const verify = parseVerifyMethods(form_info?.detail[idx], signer);
      const stage_setting = (() => {
        if (usr.action === STAGE_ACTION.review) {
          return null;
        }

        const {
          forward_enable = false,
          decline_enable = true,
          viewable_in_processing = true,
          viewable_in_completed = true,
          reviewed_skip_confirm = true,
        } = usr.stage_setting || {};

        return {
          forward_enable,
          decline_enable,
          viewable_in_processing,
          viewable_in_completed,
          reviewed_skip_confirm,
        };
      })();

      if (signer.signer_type === "form_signer") {
        return {
          key: idx,
          uid: `use-${uuid()}`,
          signer_type: signer.signer_type,
          role: signer.role,
          requisite: signer.requisite,
          stage_setting,
          verify,
        };
      }

      return {
        key: idx,
        uid: `use-${uuid()}`,
        signer_type: signer.signer_type,
        name: signer.name,
        email: signer.email,
        role: signer.role,
        stage_setting,
        verify,
      };
    });

    // NOTE: attachments
    let attachments = [];
    form_info.detail.map((usr, idx) => {
      const signer = assignes[idx];

      if (usr.attachment_setting && usr.attachment_setting.length > 0) {
        usr.attachment_setting.map((att) => {
          attachments.push({
            ...att,
            uuid: uuid(),
            signer,
          });
        });
      }
    });

    // NOTE: stages
    const doc = yield call(getDoc, form_info.download_link);
    const vpData = yield call(getAllViewport, doc);

    if (!vpData) {
      yield put({ type: createActions.GET_TEMPLATE_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.commonError,
      });
      return;
    }

    const { viewport, rotates } = vpData;

    let stages = [];
    let fieldGroups = [];

    form_info.detail.map((usr, idx) => {
      if (usr.action === STAGE_ACTION.review) {
        return;
      }

      const isGroupReadOnly = (groupId) =>
        (usr.field_setting_groups || []).some(
          (g) => g.field_group_object_id === groupId && g.options?.read_only,
        );

      let xfdf = xfdf2Obj(usr.xfdf_text);
      // NOTE: coords should revert to 0 degree based
      xfdf.forEach((stage) => {
        const coordOri = stage.coord.map((cor) => parseInt(cor));
        const coordNew = getMyCoord(
          coordOri,
          viewport[stage.page - 1],
          rotates[stage.page - 1],
        );

        const setting = usr?.field_settings?.find(
          (itm) => itm.field_object_id === stage.id,
        );

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
            fieldType = setting.field_type;
          } else if (setting?.field_type === fieldTypes.image) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_image";
            img = setting.field_value
              ? resp.data.image_info?.images?.find(
                  (info) => info.id === parseInt(setting.field_value),
                )?.raw || null
              : null;
          } else if (setting?.field_type === fieldTypes.link) {
            fieldType = setting.field_type;
            defaultPlaceholder = "input_link";
          } else if (setting?.field_type === fieldTypes.systemTime) {
            fieldType = setting.field_type;
            defaultPlaceholder = systemTimeI18Keys[setting.options.format];
          } else {
            fieldType = setting.field_type;
          }
        }

        let tempStage = {
          assigne: assignes[idx],
          coords: coordNew,
          id: stage.id,
          page: stage.page,
          text: defaultPlaceholder,
          type: fieldType,
          ...(img ? { img } : {}),
          options: setting?.options,
        };

        if (setting?.field_type === fieldTypes.date) {
          tempStage.is_date = stage.is_date;
        }
        if (stage.style === 0 || stage.style === 1) {
          tempStage.style = stage.style;
        }

        if (setting?.custom_id) {
          tempStage.custom_id = setting.custom_id;
        }

        if (setting?.field_group_object_id) {
          tempStage.field_group_object_id = setting.field_group_object_id;
        }

        if (isGroupReadOnly(tempStage.field_group_object_id)) {
          tempStage.options = {
            ...(tempStage.options || {}),
            read_only: true,
          };
        }

        stages.push(tempStage);
      });

      // NOTE: fieldGroups
      usr.field_setting_groups?.map((g) => {
        fieldGroups.push(g);
      });
    });

    // NOTE: labels
    let labels = [];
    Object.keys(form_info.tags).forEach((key) => {
      if (form_info.tags[key]) {
        labels.push(key);
      }
    });

    const payload = {
      formId,
      templateId: resp.data.form_info.template_id,
      fileName: resp.data.form_name,
      description: resp.data.description,
      responseCount: resp.data.goal_num === -1 ? null : resp.data.goal_num,
      publicFormSentCount: Number(resp.data.sent_num) || 0,
      stopDeadline: resp.data.end_at
        ? convertDatetimeFormat(
            unixToString(resp.data.end_at, "yyyy/mm/dd", false),
          )
        : null,
      stopByDeadline: resp.data.end_at !== -1 && resp.data.end_at !== null,
      stopByResponseCount: resp.data.goal_num !== -1,
      publicFormStatus: resp.data.status,
      assignes,
      stages,
      fieldGroups,
      attachments,
      labels,
      fileUrl: form_info.download_link,
    };

    yield put({ type: createActions.GET_PUBLIC_FORM_SUC, payload });
  } catch (err) {
    console.log(err);
    yield put({ type: createActions.GET_PUBLIC_FORM_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* putPublicForm({ data }) {
  try {
    const getCreate = (state) => state.create;
    const {
      formId,
      fileName,
      description,
      assignes,
      stopByDeadline,
      stopDeadline,
      stopByResponseCount,
      responseCount,
      labels,
    } = yield select(getCreate);

    const { dataTrans, isPublish } = data;

    const toTransfer = yield call(prepareDraftData, { data: dataTrans });

    if (toTransfer.isFailed) {
      yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toTransfer.error,
      });
      return;
    }

    let isBlank = false;
    let isMailInvalid = false;
    let isPhoneInvalid = false;
    let isNationalIdInvalid = false;
    assignes.map((signer) => {
      if (signer.signer_type === "form_signer") {
        return;
      }

      if (
        !signer.email ||
        signer.email.length < 1 ||
        !signer.name ||
        signer.name.length < 1
      ) {
        isBlank = true;
        return;
      }

      if (!isEmail(signer.email)) {
        isMailInvalid = true;
        return;
      }

      if (signer.verify?.length > 0) {
        const smsItm = signer.verify.find((itm) => itm.verify_type === "sms");

        if (smsItm && !isPhone(smsItm.verify_source, true)) {
          isPhoneInvalid = true;
          return;
        }
      }
    });

    if (isBlank) {
      yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.publicFormCheckFal,
      });
      return;
    }

    if (isMailInvalid) {
      yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.notEmail,
      });
      return;
    }

    if (isPhoneInvalid) {
      yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.phoneRequired,
      });
      return;
    }

    if (isNationalIdInvalid) {
      yield put({ type: createActions.CHECK_SETTINGS_FAL });
      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.nationalIdRequired,
      });
      return;
    }

    const signer_infos = assignes.map((signer) => {
      if (signer.signer_type === "form_signer") {
        return {
          signer_type: "form_signer",
          requisite: signer.requisite,
        };
      }

      if (signer.verify?.length > 1) {
        const smsItm = signer.verify.find((itm) => itm.verify_type === "sms");

        return {
          signer_type: "normal_signer",
          name: signer.name,
          email: signer.email,
          phone: smsItm.verify_source,
        };
      }

      return {
        signer_type: "normal_signer",
        name: signer.name,
        email: signer.email,
      };
    });

    const dataPut = {
      id: formId,
      form_name: fileName,
      description,
      signer_infos,
      end_at: stopByDeadline ? localDatetimeToUnix(stopDeadline) : -1,
      goal_num: stopByResponseCount ? responseCount : -1,
      stages: toTransfer.stages,
      tags: labels,
      status: isPublish ? "publish" : "unpublish",
    };

    if (typeof toTransfer.receiver_lang !== "undefined") {
      dataPut.receiver_lang = toTransfer.receiver_lang;
    }

    if (typeof toTransfer.cc_info !== "undefined") {
      dataPut.cc_info = toTransfer.cc_info;
    }
    const resp = yield call(createApi.putPublicForm, dataPut);

    if (resp.error_code) {
      yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });

      if (resp.error_code === 400220) {
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.emailFormatError,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_TOAST,
        payload: toastStatus.putPublicFormFal,
      });
      return;
    }

    yield put({ type: createActions.PUT_PUBLIC_FORM_SUC });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.putPublicFormSuc,
    });
    yield delay(5000);
    yield call(Router.push, "/public-forms");
  } catch (err) {
    console.log(err);
    yield put({ type: createActions.PUT_PUBLIC_FORM_FAL });
    yield put({
      type: commonActions.OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  }
}

function* getCurrentBase64Pdf() {
  const { files, thumbnail: pdfNotReplaced } = yield select(
    (state) => state.create,
  );
  if (pdfNotReplaced) {
    return null;
  }

  const url = URL.createObjectURL(files[0]);
  yield put({
    type: createActions.SET_FILE_URL,
    payload: { url },
  });

  const blobToBase64 = (url) => {
    return new Promise((resolve) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onloadend = () => {
            resolve(fileReader.result);
          };
        });
    });
  };

  const ignoreType = (base64String) => {
    return base64String.split(",").pop();
  };
  const base64String = yield call(blobToBase64, url);

  return ignoreType(base64String);
}

function* postKioskCreate({ data }) {
  try {
    const { template_id, stages } = data;
    const getAuth = (state) => state.auth;
    const { isFrontDesk } = yield select(getAuth);

    if (!template_id || !stages) {
      yield put({ type: createActions.POST_KIOSK_CREATE_FAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: EMBEDDED_STATUS.paramsError },
      });
      return;
    }

    const resp = yield call(createApi.getTemplate, template_id);
    if (!resp.data || !resp.data.detail) {
      yield put({ type: createActions.POST_KIOSK_CREATE_FAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: EMBEDDED_STATUS.unableFetchTemplate },
      });
      return;
    }

    // NOTE: stages number mismatch
    if (resp.data.detail.length !== stages.length) {
      yield put({ type: createActions.POST_KIOSK_CREATE_FAL });
      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: EMBEDDED_STATUS.invalidTemplate },
      });
      return;
    }

    // NOTE: non-order
    if (!resp.data.has_order) {
      yield put({ type: createActions.POST_KIOSK_CREATE_FAL });

      if (isFrontDesk) {
        yield put({ type: createActions.RESET_CREATE });
        yield put({
          type: commonActions.OPEN_TOAST,
          payload: toastStatus.frontDeskTemplateError,
        });
        return;
      }

      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType: EMBEDDED_STATUS.orderInvalidTemplate },
      });
      return;
    }

    const file = yield call(getCurrentBase64Pdf);
    const payload = { ...data, file };

    const respCreate = yield call(createApi.postKiosk, payload);

    if (!respCreate.data) {
      yield put({ type: createActions.POST_KIOSK_CREATE_FAL });

      let coverType;
      if (resp.error_code === 4001003) {
        coverType = EMBEDDED_STATUS.overLimit;
      } else if (resp.error_code === 401207) {
        coverType = EMBEDDED_STATUS.invalidTask;
      } else {
        coverType = EMBEDDED_STATUS.unableCreateKiosk;
      }

      yield put({
        type: commonActions.OPEN_COVER,
        payload: { coverType },
      });
      return;
    }

    yield put({ type: createActions.POST_KIOSK_CREATE_SUC });
    yield put({
      type: signActions.SET_TASK_ID,
      payload: respCreate.data.sign_task_id,
    });
    return;
  } catch (err) {
    console.log(err);
    return yield put({ type: createActions.POST_KIOSK_CREATE_FAL });
  }
}

function* deleteStage({ id }) {
  const stages = yield select((state) => state.create.stages);
  const filteredStages = stages.filter((sign) => sign.signid !== id);

  yield put({
    type: createActions.DELETE_STAGE_SUC,
    payload: filteredStages,
  });
}

function* setReplaceTemplate() {
  const { tmpFiles } = yield select((state) => state.create);
  if (!tmpFiles || tmpFiles.length === 0) {
    return;
  }
  const { fileUrl } = yield call(getDocTotalPagesAndFileSize, tmpFiles[0]);
  yield put({
    type: createActions.SET_REPLACETEMPLATE_SUC,
    payload: { fileUrl, tmpFiles },
  });
  yield put({
    type: commonActions.OPEN_TOAST,
    payload: toastStatus.templateReplaceFileInfoSuc,
  });
}

const eventListeners = [
  takeEvery(createActions.CHECK_SETTINGS, checkSettings),
  takeEvery(createActions.SET_ASSIGNES, setAssignes),
  takeEvery(createActions.POST_DRAFT, postDraft),
  takeEvery(createActions.PUT_DRAFT, putDraft),
  takeEvery(createActions.POST_DRAFT_TO_CREATE, postDraftToCreate),
  takeEvery(createActions.POST_CREATE, postCreate),
  takeEvery(createActions.REVERT_DRAFT, revertDraft),
  takeEvery(createActions.POST_SIGN_AND_SEND, postSignAndSend),
  takeEvery(createActions.POST_TEMPLATE, postTemplate),
  takeEvery(createActions.PUT_TEMPLATE, putTemplate),
  takeEvery(createActions.GET_TEMPLATE, getTemplate),
  takeEvery(createActions.SET_ATTACHMENTS, setAttachments),
  takeEvery(createActions.SET_BULK_LIST, setBulkList),
  takeEvery(createActions.POST_BULK, postBulk),
  takeEvery(createActions.RESET_CREATE, resetCreate),
  takeEvery(createActions.GET_ASSIGNEE_SYSTEM_CA_LIST, getAssigneeSystemCAList),
  takeEvery(createActions.POST_FRONT_DESK, postFrontDesk),
  takeEvery(createActions.POST_PUBLIC_FORM, postPublicForm),
  takeEvery(createActions.GET_PUBLIC_FORM, getPublicForm),
  takeEvery(createActions.PUT_PUBLIC_FORM, putPublicForm),
  takeEvery(createActions.POST_KIOSK_CREATE, postKioskCreate),
  takeEvery(createActions.DELETE_STAGE, deleteStage),
  takeEvery(createActions.SET_REPLACETEMPLATE, setReplaceTemplate),
];

export default eventListeners;
