import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import { Textarea } from "../../../../global/styledForm";
import ButtonWithLoading from "../../../ButtonWithLoading";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Label, Hint } from "./styled";

const NotifyOwner = ({ onModalClose, data }) => {
  const { onSubmit, taskId, envelopeId } = data;
  const { t } = useTranslation("modal");
  const router = useRouter();
  const { query } = router;

  const [message, setMessage] = useState("");
  const [isBtnValid, setIsBtnValid] = useState(false);

  const isLoading = useSelector((state) => state.sign.isLoading);

  const onMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (newMessage && newMessage.length > 0) {
      setIsBtnValid(true);
    } else {
      setIsBtnValid(false);
    }
  };

  const onConfirm = () => {
    onSubmit({
      message,
      ...(query.code ? { code: query.code } : {}),
      ...(envelopeId ? { envelopeId: envelopeId } : {}),
      ...(taskId ? { taskId: taskId } : {}),
    });
  };

  return (
    <Wrapper>
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_notify_owner_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Label>{t("modal_notify_owner_label")}</Label>
          <Textarea
            onChange={onMessageChange}
            value={message}
            placeholder={t("modal_notify_owner_msg")}
          />
          <Hint>{t("modal_notify_owner_hint")}</Hint>
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
          type={isBtnValid ? "primaryFlex" : "disabled"}
          handleEvent={isBtnValid ? onConfirm : null}
        >
          {t("btn_send")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default NotifyOwner;
