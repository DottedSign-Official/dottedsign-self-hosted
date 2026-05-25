import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import ButtonWithLoading from "../../../ButtonWithLoading";
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

const ChangeNameConfirm = ({ data }) => {
  const { t } = useTranslation("modal");

  const { onSave, onRevert } = data;
  const isLoading = useSelector((state) => state.auth.isLoadingUser);

  if (!data) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? null : onRevert}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_change_name_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_change_name_confirm_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onRevert}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type="warn"
          handleEvent={onSave}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default ChangeNameConfirm;
