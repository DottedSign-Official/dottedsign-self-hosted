import React from "react";
import Router from "next/router";
import { useTranslation } from "next-i18next";

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

const TaskOnBackHint = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const onConfirm = () => {
    onModalClose();

    const redirectLink = data?.redirectLink || "/tasks";
    Router.push(redirectLink);
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_task_on_back_hint_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_task_on_back_hint_desc")}</Text>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
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

export default TaskOnBackHint;
