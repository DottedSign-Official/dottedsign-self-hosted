import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  setFileInstructions as setFileInstructionsAction,
  setAssignes,
  setAssigneFocus,
  resetCreate,
  setIsBulk as setIsBulkAction,
  setDescription as setDescriptionAction,
  setIsOrder as setIsOrderAction,
  getPublicForm as getPublicFormAction,
  setIsPublicForm as setIsPublicFormAction,
} from "../../redux/actions/create";
import Menu from "../MenuCreate";
import Input from "../Input";
import Document from "../ContentDocument";
import Assignes from "../ContentAssignes";
import Bulk from "../ContentBulk";
import Btn from "../../components/Button";
import Icon from "../../components/Icon";
import MenuBulk from "../../components/MenuBulk";
import {
  WrapperCreate,
  WrapperReset,
  WrapperSub,
  Title,
} from "../../global/styledCreate";
import {
  TipWrapper,
  TipText,
  FormDesc,
  FormDescWrapper,
  FormDescCounter,
} from "./styled";
import PanelFd from "./panelFd";

const MAX_DESC_LENGTH = 500;

const ContDocSettings = ({
  page,
  isSigners,
  isTemplate,
  isTemplateOnly,
  isFrontDesk,
  isPublicForm,
  formId,
}) => {
  const { t } = useTranslation("create");

  const [isBulkAvail, setIsBulkAvail] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const {
    templateId,
    fileInstructions,
    isTemplateEdit,
    fileUrl,
    files,
    isBulk,
    description,
  } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const setFileInstructions = (data) =>
    dispatch(setFileInstructionsAction(data));
  const setIsBulk = (data) => dispatch(setIsBulkAction(data));
  const setDescription = (data) => dispatch(setDescriptionAction(data));
  const setIsPublicForm = (data) => dispatch(setIsPublicFormAction(data));
  const setIsOrder = (data) => dispatch(setIsOrderAction(data));
  const getPublicForm = (data) => dispatch(getPublicFormAction(data));
  const currentDesc = description || "";

  useEffect(() => {
    dispatch(resetCreate(["isTemplate"]));
  }, [dispatch]);

  useEffect(() => {
    if (isPublicForm) {
      setIsPublicForm(true);
      setIsOrder(true);
    }
  }, [isPublicForm]);

  useEffect(() => {
    if (formId) {
      getPublicForm({ formId });
    }
  }, [formId]);

  useEffect(() => {
    if (!isSigners && user) {
      // NOTE: ss only
      const me = {
        name: user.name || user.email,
        email: user.email,
      };
      dispatch(setAssignes({ assignes: [me] }));
      dispatch(setAssigneFocus(me));
    }
  }, [user, isSigners, dispatch]);

  useEffect(() => {
    if (user && templateId && !isTemplateEdit && !isPublicForm) {
      setIsBulkAvail(true);
    } else {
      setIsBulkAvail(false);
    }
  }, [user, templateId, isTemplateEdit]);

  const onReset = () => {
    let exception = ["isTemplate"];

    if (page === "settings-s-n-s") {
      exception.push("assignes");
    }
    dispatch(resetCreate(exception));
  };

  const isResetBtn = (files && files.length > 0) || (templateId && fileUrl);
  const hasFileOrTemp = (files && files.length > 0) || (templateId && fileUrl);
  const isAssignes = isSigners && hasFileOrTemp;
  const isInstructions = isResetBtn && isFrontDesk;
  const bulkSendIsAccessible = user?.current_permission?.bulk_send;

  const PanelAssignes = () => {
    if (!isAssignes) {
      return null;
    }

    const isTemplateApplied = templateId !== null && !isTemplateEdit;

    if (isFrontDesk) {
      return (
        <>
          <Title>{t("manage_signers")}</Title>
          <PanelFd />
        </>
      );
    }

    if (isBulkAvail) {
      return (
        <>
          <Title>{t("manage_signers")}</Title>
          <MenuBulk
            isBulk={isBulk}
            onSelect={setIsBulk}
            bulkSendIsAccessible={bulkSendIsAccessible}
          />
          {isBulk ? (
            <Bulk />
          ) : (
            <Assignes
              isTemplateApplied={isTemplateApplied}
              isBulkMenuVisible={isBulkAvail}
            />
          )}
        </>
      );
    }

    if (isPublicForm) {
      return (
        <>
          <Title>{t("manage_signers")}</Title>
          <TipWrapper>
            <Icon type="tips" />
            <TipText>{t("public_form_manage_signers_tip")}</TipText>
          </TipWrapper>
          <Assignes isTemplateApplied={isTemplateApplied} />
        </>
      );
    }

    return (
      <>
        <Title>{t("manage_signers")}</Title>
        <Assignes isTemplateApplied={isTemplateApplied} />
      </>
    );
  };

  return (
    <>
      <Menu page={page} />
      <WrapperCreate>
        {!formId && isResetBtn && (
          <WrapperReset>
            <Btn type="icon" handleEvent={onReset}>
              <Icon type="previous" />
            </Btn>
          </WrapperReset>
        )}

        {!formId && (
          <WrapperSub>
            <Document isTemplate={isTemplate} isTemplateOnly={isTemplateOnly} />
          </WrapperSub>
        )}

        {isInstructions && (
          <WrapperSub>
            <Title>{t("task_instructions")}</Title>
            <Input
              placeholder={t("task_instructions_placeholder")}
              value={fileInstructions || ""}
              onSubmit={setFileInstructions}
            />
          </WrapperSub>
        )}

        {isPublicForm && hasFileOrTemp && (
          <WrapperSub>
            <Title>{t("form_desc")}</Title>
            <TipWrapper>
              <Icon type="tips" />
              <TipText>{t("form_desc_tip")}</TipText>
            </TipWrapper>

            <FormDescWrapper>
              <FormDesc
                placeholder="e.g. application form"
                value={currentDesc}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))
                }
              />
              <FormDescCounter>
                {t("form_desc_counter", {
                  count: currentDesc.length,
                  max: MAX_DESC_LENGTH,
                })}
              </FormDescCounter>
            </FormDescWrapper>
          </WrapperSub>
        )}

        <WrapperSub>{PanelAssignes()}</WrapperSub>
      </WrapperCreate>
    </>
  );
};

export default ContDocSettings;
