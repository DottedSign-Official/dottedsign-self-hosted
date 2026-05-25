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

const SignDeleteConfirm = ({ onModalClose, data: { onConfirm } }) => {
  const { t } = useTranslation("modal");

  const onConfirmClick = () => {
    onConfirm();
    onModalClose();
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_sign_del_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_sign_del_confirm_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={onConfirmClick}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SignDeleteConfirm;
