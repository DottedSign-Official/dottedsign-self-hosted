import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import ListReference from "../../../ListReference";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
} from "../../../../global/styledModal";
import { Label, Message } from "./styled";

const SenderMessage = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { isCompleted, message, references, links } = data;

  const onNav = (idx) => {
    window.open(links[idx]);
  };

  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_sender_message_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {message && message.length > 0 && (
            <>
              <Label>
                {t(
                  isCompleted
                    ? "modal_sender_completed_message_label"
                    : "modal_sender_message_label",
                )}
              </Label>
              <Message readOnly={true} rows={8} value={message} />
            </>
          )}
          {references && references.length > 0 && (
            <>
              <Label>{t("label_reference")}</Label>
              <ListReference references={references} onNav={onNav} />
            </>
          )}
        </Content>
      </Body>
    </Wrapper>
  );
};

export default SenderMessage;
