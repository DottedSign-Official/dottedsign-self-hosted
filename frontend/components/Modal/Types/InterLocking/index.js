import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import Button from "../../../Button";
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

const InterLocking = ({ onModalClose, data: { onUpdate, hint } }) => {
  const { t } = useTranslation("modal");
  const onClick = () => {
    onUpdate();
    onModalClose();
  };

  return (
    <Wrapper width="400px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_delete_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t(hint)}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="warn" handleEvent={onClick}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default InterLocking;
