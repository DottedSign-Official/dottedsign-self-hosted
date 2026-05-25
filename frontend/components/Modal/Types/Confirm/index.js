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

const Confirm = ({ onModalClose, onModalSubmit, data }) => {
  const { t } = useTranslation("modal");
  const {
    title,
    content,
    handleConfirm,
    handleReject,
    confirmType = "warn",
    handleGoBack,
    confirmButtonName = t("btn_delete"),
  } = data;
  const { isLoading } = useSelector((state) => state.admin);

  const onReject = () => {
    if (handleReject) {
      handleReject();
    }
    if (handleGoBack) {
      handleGoBack();
    } else {
      onModalClose();
    }
  };

  const onConfirm = () => {
    if (handleConfirm) {
      handleConfirm();
    }
    onModalSubmit();
  };

  const confirmButton = (() => {
    return (
      <ButtonWithLoading
        isLoading={isLoading}
        type={isLoading ? "disabled" : confirmType}
        handleEvent={onConfirm}
      >
        {confirmButtonName}
      </ButtonWithLoading>
    );
  })();

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onReject}>
        {handleGoBack ? <Icon type="previous" /> : <Icon type="cancel" />}
      </Close>
      <Title>{t(title)}</Title>
      <Body noScroll>
        <Content>
          <Text>{t(content)}</Text>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type={isLoading ? "disabled" : "cancel"}
          handleEvent={onReject}
        >
          <Text>{t("btn_cancel")}</Text>
        </ButtonWithLoading>
        <DividerBtn />
        {confirmButton}
      </Panel>
    </Wrapper>
  );
};

export default Confirm;
