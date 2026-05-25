import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { deleteSignTask as deleteSignTaskAction } from "../../../../redux/actions/sign";
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

const FileDelete = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const isLoading = useSelector((state) => state.sign.isLoading);
  const dispatch = useDispatch();
  const deleteSignTask = (data) => dispatch(deleteSignTaskAction(data));

  const onConfirm = () => {
    deleteSignTask(data);
  };

  if (!data) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_delete_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>
            {t(
              data.isSignAndSend
                ? "modal_delete_content_ss"
                : "modal_delete_content",
            )}
          </Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isLoading ? "disabled" : "warn"}
          handleEvent={isLoading ? null : onConfirm}
        >
          {t("btn_delete")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default FileDelete;
