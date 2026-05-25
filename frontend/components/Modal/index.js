import React, { useState, useEffect } from "react";
import Portal from "../Portal";
import { MODAL_TYPE } from "../../constants/constants";
import scrollLock from "../../helpers/scrollLock";
import WindowWidth from "../../containers/WindowWidth";

import AccountEdit from "./Types/AccountEdit";
import AccountChangePassword from "./Types/AccountChangePassword";
import ChangeNameConfirm from "./Types/ChangeNameConfirm";
import ChangePasswordConfirm from "./Types/ChangePasswordConfirm";
import CreateConfirm from "./Types/CreateConfirm";
import CheckConfirm from "./Types/CheckConfirm";
import CreateConfirmSS from "./Types/CreateConfirmSS";
import CreateConfirmTemplate from "./Types/CreateConfirmTemplate";
import CreateConfirmFrontDesk from "./Types/CreateConfirmFrontDesk";
import PublicFormSignerInfo from "./Types/PublicFormSignerInfo";
import CreateLeaveConfirm from "./Types/CreateLeaveConfirm";
import DeclineToSign from "./Types/DeclineToSign";
import FileInfo from "./Types/FileInfo";
import FileDelete from "./Types/FileDelete";
import FileRename from "./Types/FileRename";
import ManageSigners from "./Types/ManageSigners";
import SignDeleteConfirm from "./Types/SignDeleteConfirm";
import SignhereConfirm from "./Types/SignhereConfirm";
import OtpVerify from "./Types/OtpVerify";
import TaskInfoUpdate from "./Types/TaskInfoUpdate";
import NotifyOwner from "./Types/NotifyOwner";
import ChangeSigner from "./Types/ChangeSigner";
import ChangeOwner from "./Types/ChangeOwner";
import OrganizationModifyAdmin from "./Types/OrganizationModifyAdmin";
import AttachmentField from "./Types/AttachmentField";
import TemplateDel from "./Types/TemplateDel";
import TemplateRename from "./Types/TemplateRename";
import TemplateSelection from "./Types/TemplateSelection";
import TemplateChangeCode from "./Types/TemplateChangeCode";
import TemplateCopy from "./Types/TemplateCopy";
import AttachmentUpload from "./Types/AttachmentUpload";
import LabelManagement from "./Types/LabelManagement";
import LangChange from "./Types/LangChange";
import SenderMessage from "./Types/SenderMessage";
import StampCreator from "./Types/StampCreator";
import FieldProperty from "./Types/FieldProperty";
import FieldPropertyGroup from "./Types/FieldPropertyGroup";
import ImageProcessing from "./Types/ImageProcessing";
import FieldPropertySigner from "./Types/FieldPropertySigner";
import NotifyHotkeys from "./Types/NotifyHotkeys";
import SignerPermissions from "./Types/SignerPermissions";
import SignerCombineConfirm from "./Types/SignerCombineConfirm";
import GroupCreate from "./Types/GroupCreate";
import GroupMemberDelConfirm from "./Types/GroupMemberDelConfirm";
import UserInvite from "./Types/UserInvite";
import TextInput from "./Types/TextInput";
import DeclineReason from "./Types/DeclineReason";
import Label from "./Types/Label";
import LabelDeleteConfirm from "./Types/LabelDeleteConfirm";
import BackgroundRemovalConfirm from "./Types/BackgroundRemovalConfirm";
import SignerSettings from "./Types/SignerSettings";
import AuthMethod from "./Types/AuthMethod";
import AuthIdentity from "./Types/AuthIdentity";
import ChtVerify from "./Types/ChtVerify";
import CACreate from "./Types/CACreate";
import CAEdit from "./Types/CAEdit";
import SystemCAMember from "./Types/SystemCAMember";
import Confirm from "./Types/Confirm";
import Consent from "./Types/Consent";
import KioskSignerInfo from "./Types/KioskSignerInfo";
import InterLocking from "./Types/InterLocking";
import PreviewShareLink from "./Types/PreviewShareLink";
import RolesMore from "./Types/RolesMore";
import SignerSettingsFd from "./Types/SignerSettingsFd";
import TemplateAdminShare from "./Types/TemplateAdminShare";
import DeleteTemplateAdminShare from "./Types/DeleteTemplateAdminShare";
import AttachmentViewer from "./Types/AttachmentViewer";
import RoleModal from "./Types/RoleModal";
import EditTemplateDocuments from "./Types/EditTemplateDocuments";
import TaskResend from "./Types/TaskResend";
import SaveAsTemplate from "./Types/SaveAsTemplate";
import OpenLink from "./Types/OpenLink";
import ReviewComplete from "./Types/ReviewComplete";
import CheckerMsg from "./Types/CheckerMsg";
import ReviewPassedConfirm from "./Types/ReviewPassedConfirm";
import SigningGroup from "./Types/SigningGroup";
import SigningGroupDelete from "./Types/SigningGroupDelete";
import SigningGroupRename from "./Types/SigningGroupRename";
import SigningGroupShare from "./Types/SigningGroupShare";
import SigningGroupImport from "./Types/SigningGroupImport";
import SigningGroupDetails from "./Types/SigningGroupDetails";
import SigningGroupOverwrite from "./Types/SigningGroupOverwrite";
import TaskOnBackHint from "./Types/TaskOnBackHint";

import { ModalBack, ModalWrapper } from "./styled";

const getChild = (modalType) => {
  switch (modalType) {
    case MODAL_TYPE.accountChangePassword:
      return AccountChangePassword;

    case MODAL_TYPE.accountEdit:
      return AccountEdit;

    case MODAL_TYPE.createConfirm:
      return CreateConfirm;

    case MODAL_TYPE.checkConfirm:
      return CheckConfirm;

    case MODAL_TYPE.createConfirmSS:
      return CreateConfirmSS;

    case MODAL_TYPE.createConfirmFrontDesk:
      return CreateConfirmFrontDesk;

    case MODAL_TYPE.publicFormSignerInfo:
      return PublicFormSignerInfo;

    case MODAL_TYPE.changeNameConfirm:
      return ChangeNameConfirm;

    case MODAL_TYPE.changePasswordConfirm:
      return ChangePasswordConfirm;

    case MODAL_TYPE.createLeaveConfirm:
      return CreateLeaveConfirm;

    case MODAL_TYPE.fileDelete:
      return FileDelete;

    case MODAL_TYPE.fileInfo:
      return FileInfo;

    case MODAL_TYPE.fileRename:
      return FileRename;

    case MODAL_TYPE.manageSigners:
      return ManageSigners;

    case MODAL_TYPE.signDeleteConfirm:
      return SignDeleteConfirm;

    case MODAL_TYPE.signhereConfirm:
      return SignhereConfirm;

    case MODAL_TYPE.otpVerify:
      return OtpVerify;

    case MODAL_TYPE.taskInfoUpdate:
      return TaskInfoUpdate;

    case MODAL_TYPE.notifyOwner:
      return NotifyOwner;

    case MODAL_TYPE.changeSigner:
      return ChangeSigner;

    case MODAL_TYPE.changeOwner:
      return ChangeOwner;

    case MODAL_TYPE.organizationModifyAdmin:
      return OrganizationModifyAdmin;

    case MODAL_TYPE.attachmentField:
      return AttachmentField;

    case MODAL_TYPE.createConfirmTemplate:
      return CreateConfirmTemplate;

    case MODAL_TYPE.templateDel:
      return TemplateDel;

    case MODAL_TYPE.templateRename:
      return TemplateRename;

    case MODAL_TYPE.templateChangeCode:
      return TemplateChangeCode;

    case MODAL_TYPE.templateSelection:
      return TemplateSelection;

    case MODAL_TYPE.templateCopy:
      return TemplateCopy;

    case MODAL_TYPE.attachmentUpload:
      return AttachmentUpload;

    case MODAL_TYPE.labelManagement:
      return LabelManagement;

    case MODAL_TYPE.langChange:
      return LangChange;

    case MODAL_TYPE.senderMessage:
      return SenderMessage;

    case MODAL_TYPE.stampCreator:
      return StampCreator;

    case MODAL_TYPE.fieldProperty:
      return FieldProperty;

    case MODAL_TYPE.imageProcessing:
      return ImageProcessing;

    case MODAL_TYPE.fieldPropertySigner:
      return FieldPropertySigner;

    case MODAL_TYPE.notifyHotkeys:
      return NotifyHotkeys;

    case MODAL_TYPE.signerPermissions:
      return SignerPermissions;

    case MODAL_TYPE.signerCombineConfirm:
      return SignerCombineConfirm;

    case MODAL_TYPE.groupCreate:
      return GroupCreate;

    case MODAL_TYPE.groupMemberDeleteConfirm:
      return GroupMemberDelConfirm;

    case MODAL_TYPE.userInvite:
      return UserInvite;

    case MODAL_TYPE.textInput:
      return TextInput;

    case MODAL_TYPE.declineToSign:
      return DeclineToSign;

    case MODAL_TYPE.declineReason:
      return DeclineReason;

    case MODAL_TYPE.label:
      return Label;

    case MODAL_TYPE.labelDeleteConfirm:
      return LabelDeleteConfirm;

    case MODAL_TYPE.backgroundRemovalConfirm:
      return BackgroundRemovalConfirm;

    case MODAL_TYPE.signerSettings:
      return SignerSettings;

    case MODAL_TYPE.authMethod:
      return AuthMethod;

    case MODAL_TYPE.authIdentity:
      return AuthIdentity;

    case MODAL_TYPE.chtVerify:
      return ChtVerify;

    case MODAL_TYPE.caCreate:
      return CACreate;

    case MODAL_TYPE.caEdit:
      return CAEdit;

    case MODAL_TYPE.systemCAMember:
      return SystemCAMember;

    case MODAL_TYPE.confirm:
      return Confirm;

    case MODAL_TYPE.consent:
      return Consent;

    case MODAL_TYPE.kioskSignerInfo:
      return KioskSignerInfo;

    case MODAL_TYPE.interLocking:
      return InterLocking;

    case MODAL_TYPE.previewShareLink:
      return PreviewShareLink;

    case MODAL_TYPE.rolesMore:
      return RolesMore;

    case MODAL_TYPE.signerSettingsFd:
      return SignerSettingsFd;

    case MODAL_TYPE.templateAdminShare:
      return TemplateAdminShare;

    case MODAL_TYPE.deleteTemplateAdminShare:
      return DeleteTemplateAdminShare;

    case MODAL_TYPE.attachmentViewer:
      return AttachmentViewer;

    case MODAL_TYPE.roleModal:
      return RoleModal;

    case MODAL_TYPE.editTemplateDocuments:
      return EditTemplateDocuments;

    case MODAL_TYPE.taskResend:
      return TaskResend;

    case MODAL_TYPE.saveAsTemplate:
      return SaveAsTemplate;

    case MODAL_TYPE.fieldPropertyGroup:
      return FieldPropertyGroup;

    case MODAL_TYPE.openLink:
      return OpenLink;

    case MODAL_TYPE.reviewComplete:
      return ReviewComplete;

    case MODAL_TYPE.checkerMsg:
      return CheckerMsg;

    case MODAL_TYPE.reviewPassedConfirm:
      return ReviewPassedConfirm;

    case MODAL_TYPE.signingGroup:
      return SigningGroup;

    case MODAL_TYPE.signingGroupDelete:
      return SigningGroupDelete;

    case MODAL_TYPE.signingGroupRename:
      return SigningGroupRename;

    case MODAL_TYPE.signingGroupShare:
      return SigningGroupShare;

    case MODAL_TYPE.signingGroupImport:
      return SigningGroupImport;

    case MODAL_TYPE.signingGroupDetails:
      return SigningGroupDetails;

    case MODAL_TYPE.signingGroupOverwrite:
      return SigningGroupOverwrite;

    case MODAL_TYPE.taskOnBackHint:
      return TaskOnBackHint;

    default:
      return null;
  }
};

const Modal = ({ isMobile, modalType, onModalClose, onModalSubmit, data }) => {
  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInit(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const ToRender = getChild(modalType);

  scrollLock({ targetId: "modal-body-scrollable" });

  return (
    <Portal>
      <ModalBack>
        <ModalWrapper isInit={isInit} isMobile={isMobile}>
          <ToRender
            onModalClose={onModalClose}
            onModalSubmit={onModalSubmit}
            data={data}
          />
        </ModalWrapper>
      </ModalBack>
    </Portal>
  );
};

export default WindowWidth(Modal);
