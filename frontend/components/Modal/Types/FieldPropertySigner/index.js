import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import TextField from "./TextField";

// NOTE: ss
const FieldPropertySigner = ({ onModalClose, data: { options, onSend } }) => {
  const { t } = useTranslation("modal");

  const [myOption, setMyOption] = useState(options || {});

  const onSubmit = () => {
    onSend({
      alignment: myOption?.alignment,
      font_size: myOption?.fontSize,
    });
    onModalClose();
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_field_property_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <TextField onUpdate={setMyOption} t={t} options={myOption} />
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={onSubmit}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default FieldPropertySigner;
