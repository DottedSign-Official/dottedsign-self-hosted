import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import Icon from "../../../Icon";
import ButtonWithLoading from "../../../ButtonWithLoading";
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

const MemberDelConfirm = ({ onModalClose, data: { onConfirm } }) => {
  const { t } = useTranslation("modal");

  const { isLoading } = useSelector((state) => state.admin);

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_member_del_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_member_del_confirm_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type="warn"
          handleEvent={onConfirm}
        >
          {t("btn_delete")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default MemberDelConfirm;
