import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postFrontDesk as postFrontDeskAction } from "../../../../redux/actions/create";
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

const CreateConfirmFrontDesk = ({ onModalClose }) => {
  const { t } = useTranslation("modal");
  const { isLoading } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const postFrontDesk = (data) => dispatch(postFrontDeskAction(data));
  const onConfirm = () => {
    postFrontDesk();
  };

  return (
    <Wrapper width="580px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_front_desk_confirm_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_front_desk_confirm_desc")}</Text>
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
          type="primaryFlex"
          handleEvent={onConfirm}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CreateConfirmFrontDesk;
