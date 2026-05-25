import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { postChangeOwner as postChangeOwnerAction } from "../../../../redux/actions/sign";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { isEmail } from "../../../../helpers/utility";
import toastType from "../../../../constants/toast";
import Icon from "../../../Icon";
import ButtonWithLoading from "../../../ButtonWithLoading";
import { DividerBtn } from "../../../../global/styled";
import { Input } from "../../../../global/styledForm";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Panel,
} from "../../../../global/styledModal";
import { Content } from "./styled";

const ChangeOwner = ({ onModalClose, data: { taskId, envelopeId } }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const isLoading = useSelector((state) => state.sign.isLoading);

  const openToast = (payload) => dispatch(openToastAction(payload));
  const postChangeOwner = (payload) => dispatch(postChangeOwnerAction(payload));

  const isBtnValid = isEmail(email);

  const onConfirm = () => {
    if (!isBtnValid) {
      openToast({ payload: toastType.emailFormatError });
      return;
    }
    postChangeOwner({ taskId, envelopeId, email });
  };

  if (!taskId && !envelopeId) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_change_owner_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <p>{t("modal_change_owner_desc")}</p>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("modal_change_owner_placeholder")}
          />
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={isLoading ? () => {} : onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isBtnValid ? "primaryFlex" : "disabled"}
          handleEvent={isBtnValid && !isLoading ? onConfirm : null}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default ChangeOwner;
