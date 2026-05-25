import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import {
  setInfo,
  postCreate as postCreateAction,
  postDraft as postDraftAction,
  putDraft as putDraftAction,
  postDraftToCreate as postDraftToCreateAction,
  postPublicForm as postPublicFormAction,
  putPublicForm as putPublicFormAction,
} from "../../../../redux/actions/create";
import { iniSocket as iniSocketAction } from "../../../../redux/actions/socket";
import { dateAddDays, getUnix } from "../../../../helpers/time";
import { MODAL_TYPE } from "../../../../constants/constants";
import { SOCKET_CHANNEL_TYPE_SIGN } from "../../../../constants/socketTypes";
import CreateConfirmComponent from "./component";

const CreateConfirm = ({ onModalClose }) => {
  const user = useSelector((state) => state.auth.user);
  const {
    isLoading,
    envelopeId,
    taskId,
    envelopeName,
    fileName,
    files,
    fileList,
    isOrder,
    forget_remind,
    need_otp_verify,
    deadline,
    expire_remind,
    remind_days_before_expire,
    receiver_lang,
    message,
    assignes,
    assigneesWarnings,
    references,
    stages,
    fieldGroups,
    isModify,
    attachments,
    labels,
    msgRequestReceivers,
    msgCompletedReceivers,
    completedMessage,
    completedReferences,
    ccInfos,
    description,
    stopByDeadline,
    stopDeadline,
    stopByResponseCount,
    responseCount,
    formId,
    isPublicForm,
    publicFormSentCount,
  } = useSelector((state) => state.create);

  const Router = useRouter();
  const dispatch = useDispatch();
  const postPublicForm = (data) => dispatch(postPublicFormAction(data));
  const putPublicForm = (data) => dispatch(putPublicFormAction(data));
  const postDraft = (data) => dispatch(postDraftAction(data));
  const postDraftToCreate = (data) => dispatch(postDraftToCreateAction(data));
  const putDraft = (data) => dispatch(putDraftAction(data));
  const postCreate = (data) => dispatch(postCreateAction(data));
  const openModal = (data) => dispatch(openModalAction(data));
  const iniSocket = (data) => dispatch(iniSocketAction(data));

  const isPermissionsButton = user && assignes?.length > 0;

  const isInfoUpdate = false;
  const isEnvelope = Router.pathname.includes("create-envelope/assign-fields");

  const onSignerPermissions = () => {
    openModal({
      modalType: MODAL_TYPE.signerPermissions,
      modalData: {
        isInfoUpdate,
      },
    });
  };

  const onAuthIdentity = () => {
    openModal({
      modalType: MODAL_TYPE.authIdentity,
      modalData: {
        isInfoUpdate,
      },
    });
  };

  const onSettingChange = useCallback(
    (data) => {
      dispatch(setInfo(data));
    },
    [dispatch],
  );

  const onLabelChange = (operation, tag) => {
    let updatedLabels;
    if (operation === "add") {
      updatedLabels = [...(labels || []), tag];
    }
    if (operation === "delete") {
      updatedLabels = labels.filter((t) => t !== tag);
    }
    dispatch(setInfo({ labels: updatedLabels }));
  };

  const handleOpenSocket = (actionType) => {
    const isPostCreate = actionType === "confirm" && !taskId;
    if (isPostCreate) {
      iniSocket({
        channelType: SOCKET_CHANNEL_TYPE_SIGN,
      });
    }
  };

  const onAction = (actionType) => () => {
    handleOpenSocket(actionType);

    let dataTrans = {
      files,
      has_order: isOrder,
      forget_remind,
      need_otp_verify,
      receiver_lang,
      assignes,
      assigneesWarnings,
      stages,
      fieldGroups,
      uid: user.id,
      attachments,
      labels,
      msgRequestReceivers,
      msgCompletedReceivers,
      references,
      completedMessage,
      completedReferences,
      ccInfos,
    };

    if (isEnvelope) {
      dataTrans.is_envelope = isEnvelope;
      dataTrans.envelope_name = envelopeName;
      dataTrans.file_list = fileList.map((fl) => ({
        file_name: fl.fileName,
        envelope_file_id: fl.fileId,
        page_num: fl.pageNum,
        file_size_text: fl.fileSizeText,
        file: fl.file,
        file_url: fl.fileUrl,
      }));
    } else {
      dataTrans.file_name = fileName;
    }

    if (isPublicForm) {
      dataTrans.isPublicForm = isPublicForm;
      dataTrans.stopByDeadline = stopByDeadline;
      dataTrans.stopDeadline = stopDeadline;
      dataTrans.stopByResponseCount = stopByResponseCount;
      dataTrans.responseCount = responseCount;
      dataTrans.description = description;
    }

    // NOTE: optional envelopeId & taskId
    if (envelopeId) {
      dataTrans.envelopeId = envelopeId;
    }
    if (taskId) {
      dataTrans.taskId = taskId;
    }

    // NOTE: optional, expire date
    if (deadline) {
      let manifiedDeadline = null;

      if (deadline === 7 || deadline === 30) {
        manifiedDeadline = dateAddDays(new Date(), deadline);
      } else {
        manifiedDeadline = new Date(deadline);
      }

      dataTrans.deadline = getUnix(manifiedDeadline);
      dataTrans.expire_remind = expire_remind;

      if (expire_remind) {
        dataTrans.remind_days_before_expire = remind_days_before_expire;
      }
    }

    // NOTE: optional, message
    if (message) {
      dataTrans.message = message;
    }
    if (isPublicForm) {
      const isEdit = !!formId;
      if (actionType === "saveForm") {
        return isEdit
          ? putPublicForm({ dataTrans, isPublish: false })
          : postPublicForm({ dataTrans, isPublish: false });
      } else if (actionType === "publishForm") {
        return isEdit
          ? putPublicForm({ dataTrans, isPublish: true })
          : postPublicForm({ dataTrans, isPublish: true });
      }
    }

    const isDraft = !!(taskId || envelopeId);
    if (actionType === "draft") {
      return isDraft ? putDraft(dataTrans) : postDraft(dataTrans);
    } else if (actionType === "confirm") {
      return isDraft ? postDraftToCreate(dataTrans) : postCreate(dataTrans);
    }

    return null;
  };

  useEffect(() => {
    if (!taskId && !envelopeId && user) {
      onSettingChange({
        receiver_lang: user.preference?.receiver_lang,
        forget_remind: user.forget_remind,
        expire_remind: user.expire_remind,
        remind_days_before_expire: user.remind_days_before_expire,
        need_otp_verify: user.force_receiver_otp,
      });
    }
  }, [taskId, envelopeId, user, onSettingChange]);

  return (
    <CreateConfirmComponent
      isLoading={isLoading}
      isOrder={isOrder}
      forget_remind={forget_remind}
      deadline={deadline}
      expire_remind={expire_remind}
      remind_days_before_expire={remind_days_before_expire}
      receiver_lang={receiver_lang}
      myLabels={labels}
      assignes={assignes}
      ccInfos={ccInfos}
      isPublicForm={isPublicForm}
      stopByDeadline={stopByDeadline}
      stopDeadline={stopDeadline}
      stopByResponseCount={stopByResponseCount}
      responseCount={responseCount}
      formId={formId}
      publicFormSentCount={publicFormSentCount}
      message={message}
      completedMessage={completedMessage}
      references={references}
      completedReferences={completedReferences}
      msgRequestReceivers={msgRequestReceivers}
      msgCompletedReceivers={msgCompletedReceivers}
      isModify={isModify}
      isPermissionsButton={isPermissionsButton}
      onModalClose={onModalClose}
      onSignerPermissions={onSignerPermissions}
      onSettingChange={onSettingChange}
      onLabelChange={onLabelChange}
      onAuthIdentity={onAuthIdentity}
      onDraft={onAction("draft")}
      onConfirm={onAction("confirm")}
      onSaveForm={onAction("saveForm")}
      onPublishForm={onAction("publishForm")}
    />
  );
};

export default CreateConfirm;
