import React from "react";
import { useTranslation } from "react-i18next";
import { postReviewDone as postReviewDoneAction } from "../../../../redux/actions/sign";
import Button from "../../../Button";
import { useSelector, useDispatch } from "react-redux";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Title,
  Body,
  Content,
  Text,
  Panel,
} from "../../../../global/styledModal";

const ReviewPassedConfirm = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const { isLoading } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const postReviewDone = (data) => dispatch(postReviewDoneAction(data));

  const onConfirm = () => {
    postReviewDone({
      dispatch,
    });
  };

  return (
    <Wrapper width="470px">
      <Title>{t("modal_check_finish_title")}</Title>
      <Body>
        <Content>
          <Text>{t("modal_check_finish_desc")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_close")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={isLoading ? null : onConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default ReviewPassedConfirm;
