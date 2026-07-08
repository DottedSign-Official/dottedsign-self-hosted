import React from "react";
import { useTranslation } from "next-i18next";
import Item from "./item";
import LoadingComponent from "../LoadingComponent";
import { Wrapper } from "./styled";
import { LicenseWrapper } from "../../containers/License";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import { useLicenseReady } from "../../helpers/license";

const Menu = ({
  menu: {
    signerStatus,
    auditTrail,
    downloadPDF,
    downloadAuditTrail,
    rename,
    declineToSign,
    changeSigner,
    notifyOwner,
    changeOwner,
    previewShareLink,
    saveAsTemplate,
    manageTags,
    deleteTask,
    templateReplaceDocument,
    taskResend,
    completionPassword,
  },
  isMenuUpward,
  onFileInfoClick,
  onFileDeleteClick,
  onDownload,
  onGetAudiTrail,
  onFileRenameClick,
  onDeclineToSign,
  onChangeSigner,
  onChangeOwner,
  onNotifyOwner,
  onGetPreviewShareLink,
  onSaveAsTemplate,
  onLabel,
  onTaskResend,
  onCompletionPassword,
}) => {
  const { t } = useTranslation("common");

  const licenseReady = useLicenseReady();
  const licenseRequired = changeSigner?.isVisible || declineToSign?.isVisible;

  if (licenseRequired && !licenseReady) {
    return (
      <Wrapper>
        <LoadingComponent />
      </Wrapper>
    );
  }

  return (
    <Wrapper
      isMenuUpward={isMenuUpward}
      onMouseDown={(e) => e.preventDefault()}
    >
      {signerStatus?.isVisible && (
        <Item
          icon="menuInfo"
          text={t("signer_status")}
          onClickEvent={() => onFileInfoClick("signer_status")}
        />
      )}
      {auditTrail?.isVisible && (
        <Item
          icon="menuAuditTrail"
          text={t("audit_trail")}
          onClickEvent={() => onFileInfoClick("audit_trail")}
        />
      )}
      {downloadPDF?.isVisible && (
        <Item
          icon="download"
          text={t("task_more_download")}
          onClickEvent={onDownload}
        />
      )}
      {downloadAuditTrail?.isVisible && (
        <Item
          icon="download"
          text={t("task_more_download_audit")}
          onClickEvent={onGetAudiTrail}
        />
      )}
      {rename?.isVisible && (
        <Item
          icon="menuRename"
          text={t("task_more_rename")}
          onClickEvent={onFileRenameClick}
        />
      )}
      {declineToSign?.isVisible && (
        <LicenseWrapper type={LICENSE_TYPE.DECLINE_TASK}>
          <Item
            icon="forbidden"
            text={t("task_more_decline_to_sign")}
            onClickEvent={onDeclineToSign}
          />
        </LicenseWrapper>
      )}
      {changeSigner?.isVisible && (
        <LicenseWrapper type={LICENSE_TYPE.CHANGE_SIGNER}>
          <Item
            icon="changeSigner"
            text={t("task_more_change_signer")}
            onClickEvent={onChangeSigner}
          />
        </LicenseWrapper>
      )}
      {changeOwner?.isVisible && (
        <Item
          icon="changeSigner"
          text={t("task_more_change_owner")}
          onClickEvent={onChangeOwner}
        />
      )}
      {notifyOwner?.isVisible && (
        <Item
          icon="changeSigner"
          text={t("task_more_notify_owner")}
          onClickEvent={onNotifyOwner}
        />
      )}
      {previewShareLink?.isVisible && (
        <Item
          icon="share"
          text={t("preview_share_link")}
          onClickEvent={onGetPreviewShareLink}
        />
      )}

      {completionPassword?.isVisible && (
        <Item
          icon="lock"
          text={t("task_more_completion_password")}
          onClickEvent={onCompletionPassword}
        />
      )}

      {taskResend?.isVisible && (
        <Item
          icon="copy"
          text={t("post_duplicate_sign_task")}
          onClickEvent={onTaskResend}
        />
      )}

      {saveAsTemplate?.isVisible && (
        <Item
          icon="saveAsTemplate"
          text={t("save_as_template")}
          onClickEvent={onSaveAsTemplate}
        />
      )}

      {manageTags?.isVisible && (
        <Item icon="tag" text={t("label_management")} onClickEvent={onLabel} />
      )}

      {deleteTask?.isVisible && (
        <Item
          icon="menuDelete"
          text={t("task_more_delete")}
          onClickEvent={onFileDeleteClick}
        />
      )}
      {templateReplaceDocument?.isVisible && (
        <Item
          icon="transfer"
          text={t("template_replace_document")}
          onClickEvent={templateReplaceDocument.onClickEvent}
        />
      )}
    </Wrapper>
  );
};

export default Menu;
