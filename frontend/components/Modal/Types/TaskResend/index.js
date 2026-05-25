import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postDuplicateSignTask as postDuplicateSignTaskAction } from "../../../../redux/actions/sign";
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

const TaskResend = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const isLoading = useSelector((state) => state.sign.isLoading);
  const dispatch = useDispatch();
  const postDuplicateSignTask = (data) =>
    dispatch(postDuplicateSignTaskAction(data));

  const onConfirm = () => {
    postDuplicateSignTask({ ...data });
  };

  if (!data) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_task_resend_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_task_resend_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isLoading ? "disabled" : "primaryFlex"}
          handleEvent={onConfirm}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default TaskResend;
