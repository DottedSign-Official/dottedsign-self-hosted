import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Checkbox from "../../../Checkbox";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Block, Label, Hint, Item } from "./styled";

const SignerSettings = ({ onModalClose, data }) => {
  const { signer, onConfirm, onPrevious } = data;
  const [isNotify, setIsNotify] = useState(signer.custom_setting?.informable);
  const { t } = useTranslation("modal");

  const onToggleNotify = () => {
    setIsNotify(!isNotify);
  };

  const onModalCancel = () => {
    onPrevious ? onPrevious() : onModalClose();
  };

  const onModalConfirm = () => {
    const payload = {
      ...signer,
      custom_setting: {
        ...signer.custom_setting,
        informable: isNotify,
      },
    };

    onConfirm(payload);
    onModalCancel();
  };

  if (!data || !data.signer || !data.onConfirm) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={onModalCancel}>
        <Icon type={onPrevious ? "previous" : "cancel"} />
      </Close>

      <Title>{t("modal_signer_advance_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Block>
            <Label>{t("receive_notification")}</Label>
            <Hint>
              <Icon type="tips" />
              <p>{t("hint_receiver_notification")}</p>
            </Hint>
            <Item>
              <Checkbox isChecked={isNotify} onToggle={onToggleNotify} />
              <p>{t("allow_notify")}</p>
            </Item>
          </Block>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onModalCancel}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primary" handleEvent={onModalConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SignerSettings;
