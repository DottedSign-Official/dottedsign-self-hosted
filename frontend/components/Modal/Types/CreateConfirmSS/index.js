import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postSignAndSend as postSignAndSendAction } from "../../../../redux/actions/create";
import { iniSocket as iniSocketAction } from "../../../../redux/actions/socket";
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
import { SOCKET_CHANNEL_TYPE_SIGN } from "../../../../constants/socketTypes";

const CreateConfirm = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const { isLoading, fileName, files, stages } = useSelector(
    (state) => state.create,
  );
  const dispatch = useDispatch();
  const postSignAndSend = (data) => dispatch(postSignAndSendAction(data));
  const iniSocket = (data) => dispatch(iniSocketAction(data));

  const onConfirm = () => {
    let toTransfer = {
      file_name: fileName,
      files,
      stages,
    };

    iniSocket({
      channelType: SOCKET_CHANNEL_TYPE_SIGN,
    });
    postSignAndSend(toTransfer);
  };

  return (
    <Wrapper width="580px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_sign_and_Send_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_sign_and_Send_confirm_desc")}</Text>
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
          id="Edit-Field-Send-SignYourself"
          type="primaryFlex"
          handleEvent={onConfirm}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CreateConfirm;
