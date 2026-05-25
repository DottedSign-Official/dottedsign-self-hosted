import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Title,
  Body,
  Content,
  Text,
  Panel,
} from "../../../../global/styledModal";
import Button from "../../../Button";

const BackgroundRemovalConfirm = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();
  const { onSubmit, onCancel } = data;

  const handleClose = () => {
    onCancel(dispatch);
    onModalClose();
  };

  return (
    <Wrapper width="470px">
      <Title>{t("modal_stamp_upload_background_remove_title")}</Title>
      <Body noScroll>
        <Content>
          <Text>{t("modal_stamp_upload_background_remove_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type={"cancel"} handleEvent={handleClose}>
          <Text>{t("btn_send")}</Text>
        </Button>
        <DividerBtn />
        <Button type={"primary"} handleEvent={() => onSubmit(dispatch)}>
          {t("btn_apply")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default BackgroundRemovalConfirm;
