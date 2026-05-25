import React from "react";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { resetCreate as resetCreateAction } from "../../../../redux/actions/create";
import Button from "../../../Button";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Text,
  Panel,
} from "../../../../global/styledModal";

const CreateLeaveConfirm = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const dispatch = useDispatch();
  const resetCreate = () => dispatch(resetCreateAction());

  const onCancel = () => {
    onModalClose();
  };

  const onConfirm = () => {
    onModalClose();
    resetCreate();

    if (typeof window === "undefined") {
      return null;
    }

    if (data?.backRoute) {
      Router.push(data.backRoute);
      return;
    }

    Router.push("/tasks");
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_create_leave_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>
            {t(
              data && data.isTemplate
                ? "modal_template_leave_confirm_content"
                : "modal_create_leave_confirm_content",
            )}
          </Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onCancel}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="warn" handleEvent={onConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default CreateLeaveConfirm;
