import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  Panel,
} from "../../../../global/styledModal";
import { Text } from "./styled";

const ReviewComplete = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const { isReview, onConfirm } = data;
  const [isLoading, setIsLoading] = useState(false);
  const { user, isFake } = useSelector((state) => state.auth);

  const onLeave = () => {
    if (user && !isFake) {
      Router.push("/tasks");
      onModalClose();
    } else {
      window.location = "/";
    }
  };

  const onConfirmModal = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    onConfirm();
  };

  const title = isReview
    ? "modal_review_complete_review_title"
    : "modal_review_complete_sign_title";
  const desc = isReview
    ? "modal_review_complete_review_desc"
    : "modal_review_complete_sign_desc";

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t(title)}</Title>
      <Body>
        <Content>
          <Text>{t(desc)}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onLeave}>
          {t("btn_leave")}
        </Button>
        <DividerBtn />
        <Button
          type={isLoading ? "disabled" : "primaryFlex"}
          handleEvent={onConfirmModal}
        >
          {t("btn_continue")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default ReviewComplete;
