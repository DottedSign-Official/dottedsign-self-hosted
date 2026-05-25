import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useEventListener } from "../../helpers/customHooks";
import { filterSignerAssignes } from "../../helpers/assignees/review";
import { openModal as openModalAction } from "../../redux/actions/common";
import {
  setEnvelopeName as setEnvelopeNameAction,
  setFileName as setFileNameAction,
  setFileList as setFileListAction,
  setFileFocus as setFileFocusAction,
  checkSettings as checkSettingsAction,
  resetCreate as resetCreateAction,
  postBulk as postBulkAction,
} from "../../redux/actions/create";
import { MODAL_TYPE } from "../../constants/constants";
import MenuCreate from "../../components/MenuCreate";

const MenuCreateContainer = ({ page, isViewOnly }) => {
  const Router = useRouter();

  const [isSignerDup, setIsSignerDup] = useState(false);

  const {
    isLoading,
    envelopeName,
    fileName,
    files,
    fileList,
    fileFocus,
    assignes,
    assigneesWarnings,
    isBulk,
    isOrder,
  } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setEnvelopeName = (name) => dispatch(setEnvelopeNameAction(name));
  const setFileName = (name) => dispatch(setFileNameAction(name));
  const setFileList = (list) => dispatch(setFileListAction(list));
  const setFileFocus = (fileFocus) => dispatch(setFileFocusAction(fileFocus));
  const checkSettings = (data) => dispatch(checkSettingsAction(data));
  const resetCreate = () => dispatch(resetCreateAction());
  const postBulk = () => dispatch(postBulkAction());

  const currentRouterType = () => {
    if (Router.pathname.includes("create-envelope/prepare-doc")) {
      return "envelope_prepare";
    }
    if (Router.pathname.includes("create-envelope/assign-fields")) {
      return "envelope_assign";
    } else {
      return "normal";
    }
  };

  const onUnload = (e) => {
    let confirmationMessage = "all changes will be discarded";

    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };

  useEventListener(
    "beforeunload",
    onUnload,
    typeof window !== "undefined" ? window : null,
  );

  useEffect(() => {
    if (isOrder) {
      setIsSignerDup(false);
    } else {
      const signers = filterSignerAssignes(assignes);
      const reviewers = assignes.filter((a) => a.action === "review");
      let isDup = false;

      // NOTE: signer dup
      for (let signerIdx = 0; signerIdx < signers.length; signerIdx++) {
        const signer = signers[signerIdx];
        if (signer.signer_type === "form_signer") {
          continue;
        }
        if (
          signers.findIndex(
            (as) =>
              as.email === signer.email && as.signer_type !== "form_signer",
          ) !== signerIdx
        ) {
          isDup = true;
          break;
        }
      }

      // NOTE: reviewer dup
      if (!isDup) {
        for (
          let reviewerIdx = 0;
          reviewerIdx < reviewers.length;
          reviewerIdx++
        ) {
          if (
            reviewers.findIndex(
              (as) => as.email === reviewers[reviewerIdx].email,
            ) !== reviewerIdx
          ) {
            isDup = true;
            break;
          }
        }
      }

      setIsSignerDup(isDup);
    }
  }, [isOrder, assignes]);

  let isTemplate = false;
  let backRoute = "/tasks";
  let onNext;

  switch (page) {
    case "settings-c-n-i":
      onNext = () => {
        if (isBulk) {
          // NOTE: bulk send
          return postBulk();
        }

        return checkSettings({
          files,
          assignes,
          assigneesWarnings,
          nextPage: "/create-task/assign-fields",
        });
      };
      break;

    case "settings-s-n-s":
      onNext = () => {
        checkSettings({
          files,
          assignes,
          nextPage: "/sign-and-send/assign-fields",
        });
      };
      break;

    case "settings-create-envelope-task":
      onNext = () => {
        checkSettings({
          files,
          assignes,
          nextPage: "/create-envelope/assign-fields",
        });
      };
      break;

    case "settings-public-form-create":
      onNext = () => {
        checkSettings({
          files,
          assignes,
          assigneesWarnings,
          nextPage: "/public-form/assign-fields",
          isPublicForm: true,
        });
      };
      backRoute = "/public-forms";
      break;

    case "settings-template":
      onNext = () => {
        checkSettings({
          files,
          assignes,
          nextPage: "/template/assign-fields",
          isTemplate: true,
        });
      };
      isTemplate = true;
      backRoute = "/settings/template";
      break;

    case "details-c-n-i":
      onNext = () => {
        openModal({
          modalType: isSignerDup
            ? MODAL_TYPE.signerCombineConfirm
            : MODAL_TYPE.createConfirm,
          modalData: isSignerDup && {
            onConfirm: () => openModal({ modalType: MODAL_TYPE.createConfirm }),
          },
        });
      };
      break;

    case "details-s-n-s":
      onNext = () => {
        openModal({ modalType: MODAL_TYPE.createConfirmSS });
      };
      break;

    case "details-template":
      onNext = () => {
        openModal({ modalType: MODAL_TYPE.createConfirmTemplate });
      };
      isTemplate = true;
      backRoute = "/settings/template";
      break;

    case "front-desk":
      onNext = () => {
        openModal({ modalType: MODAL_TYPE.createConfirmFrontDesk });
      };
      break;

    case "public-form-create":
      onNext = () => {
        openModal({ modalType: MODAL_TYPE.createConfirm });
      };
      backRoute = "/public-forms";
      break;

    default:
      break;
  }

  const onBackSettings = () => {
    resetCreate();

    if (typeof window !== "undefined") {
      return Router.push("/settings/template");
    }

    return null;
  };

  const onCancel = () => {
    openModal({
      modalType: MODAL_TYPE.createLeaveConfirm,
      modalData: { backRoute, isTemplate },
    });
  };

  return (
    <MenuCreate
      isLoading={isLoading}
      isViewOnly={isViewOnly}
      currentRouterType={currentRouterType()}
      envelopeName={envelopeName}
      setEnvelopeName={setEnvelopeName}
      fileName={fileName}
      setFileName={setFileName}
      fileList={fileList}
      setFileList={setFileList}
      setFileFocus={setFileFocus}
      fileFocus={fileFocus}
      onNext={onNext}
      onCancel={onCancel}
      onBackSettings={onBackSettings}
    />
  );
};

export default MenuCreateContainer;
