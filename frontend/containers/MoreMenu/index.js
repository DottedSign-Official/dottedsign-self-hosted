import React from "react";
import { i18n } from "next-i18next";
import { useDispatch } from "react-redux";
import * as commonActions from "../../redux/actions/common";
import * as signActions from "../../redux/actions/sign";
import { MODAL_TYPE } from "../../constants/constants";
import WindowWidth from "../../containers/WindowWidth";
import MoreMenuComponent from "../../components/MoreMenu";

const MoreMenuContainer = ({ isMobile, menu, isMenuUpward }) => {
  const {
    signerStatus,
    auditTrail,
    downloadPDF,
    downloadAuditTrail,
    rename,
    declineToSign,
    changeSigner,
    changeOwner,
    notifyOwner,
    previewShareLink,
    saveAsTemplate,
    manageTags,
    deleteTask,
    taskResend,
    completionPassword,
  } = menu;

  // NOTE: containers/MoreMenu
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(commonActions.openModal(data));
  const getDownload = (data) => dispatch(signActions.getDownloadFile(data));
  const getAuditTrail = (data) => dispatch(signActions.getAuditTrail(data));
  const getPreviewShareLink = (data) =>
    dispatch(signActions.getPreviewShareLink(data));
  const postNotifySender = (data) =>
    dispatch(signActions.postNotifySender(data));

  const onFileInfoClick = (tabType) => {
    const modalData = { tabType, data: {} };
    if (tabType === "signer_status") {
      modalData.data = signerStatus.data;
    } else if (tabType === "audit_trail") {
      modalData.data = auditTrail.data;
    }

    const payload = {
      modalType: MODAL_TYPE.fileInfo,
      modalData,
    };
    openModal(payload);
  };

  const onFileDeleteClick = () => {
    const payload = {
      modalType: MODAL_TYPE.fileDelete,
      modalData: deleteTask.data,
    };
    openModal(payload);
  };

  const onTaskResend = () => {
    const payload = {
      modalType: MODAL_TYPE.taskResend,
      modalData: taskResend.data,
    };
    openModal(payload);
  };

  const onDownload = () => {
    getDownload(downloadPDF.data);
  };

  const onGetAudiTrail = () => {
    getAuditTrail({
      ...downloadAuditTrail.data,
      isMobile,
    });
  };

  const onFileRenameClick = () => {
    const payload = {
      modalType: MODAL_TYPE.fileRename,
      modalData: rename.data,
    };
    openModal(payload);
  };

  const onDeclineToSign = () => {
    const payload = {
      modalType: MODAL_TYPE.declineToSign,
      modalData: declineToSign.data,
    };
    openModal(payload);
  };

  const onChangeSigner = () => {
    const payload = {
      modalType: MODAL_TYPE.changeSigner,
      modalData: changeSigner.data,
    };
    openModal(payload);
  };

  const onChangeOwner = () => {
    const payload = {
      modalType: MODAL_TYPE.changeOwner,
      modalData: changeOwner.data,
    };
    openModal(payload);
  };

  const onNotifyOwner = () => {
    const payload = {
      modalType: MODAL_TYPE.notifyOwner,
      modalData: {
        onSubmit: postNotifySender,
        ...notifyOwner.data,
      },
    };
    openModal(payload);
  };

  const onGetPreviewShareLink = () => {
    getPreviewShareLink({ ...previewShareLink.data, language: i18n.language });
  };

  const onCompletionPassword = () => {
    const payload = {
      modalType: MODAL_TYPE.completionPassword,
      modalData: completionPassword.data,
    };
    openModal(payload);
  };

  const onSaveAsTemplate = () => {
    const payload = {
      modalType: MODAL_TYPE.saveAsTemplate,
      modalData: saveAsTemplate.data,
    };
    openModal(payload);
  };

  const onLabel = () => {
    const { taskId, envelopeId, tags } = manageTags.data;
    openModal({
      modalType: MODAL_TYPE.labelManagement,
      modalData: {
        taskId,
        envelopeId,
        labels: tags,
        target: "task",
      },
    });
  };

  return (
    <MoreMenuComponent
      menu={menu}
      isMenuUpward={isMenuUpward}
      onFileInfoClick={onFileInfoClick}
      onFileDeleteClick={onFileDeleteClick}
      onDownload={onDownload}
      onGetAudiTrail={onGetAudiTrail}
      onFileRenameClick={onFileRenameClick}
      onDeclineToSign={onDeclineToSign}
      onChangeSigner={onChangeSigner}
      onChangeOwner={onChangeOwner}
      onNotifyOwner={onNotifyOwner}
      onGetPreviewShareLink={onGetPreviewShareLink}
      onCompletionPassword={onCompletionPassword}
      onSaveAsTemplate={onSaveAsTemplate}
      onLabel={onLabel}
      onTaskResend={onTaskResend}
    />
  );
};

export default WindowWidth(MoreMenuContainer);
