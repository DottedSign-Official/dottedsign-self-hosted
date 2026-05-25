import React from "react";
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
  Panel,
} from "../../../../global/styledModal";
import { Text } from "./styled";

const OpenLink = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { link } = data;

  const onCancel = () => {
    onModalClose();
  };

  const onConfirm = () => {
    onModalClose();

    if (typeof window === "undefined") {
      return null;
    }

    window.open(link, "_blank");
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_open_link_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{`${t("modal_open_link_desc")}\n\n${link}`}</Text>
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

export default OpenLink;
