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
  Text,
  Panel,
} from "../../../../global/styledModal";

const DeclineReasonDeleteConfirm = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { onConfirm } = data;
  const { isLoading } = useSelector((state) => state.label);

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_label_del_title")}</Title>
      <Body noScroll>
        <Content>
          <Text>{t("modal_label_del_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type={isLoading ? "disabled" : "cancel"}
          handleEvent={onModalClose}
        >
          <Text>{t("btn_cancel")}</Text>
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isLoading ? "disabled" : "warn"}
          handleEvent={onConfirm}
        >
          {t("btn_delete")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default DeclineReasonDeleteConfirm;
