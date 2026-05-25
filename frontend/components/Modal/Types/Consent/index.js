import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import Checkbox from "../../../Checkbox";
import Button from "../../../Button";
import { Wrapper, Title, Body, Content } from "../../../../global/styledModal";
import { Desc, Text, Term, Label, Panel } from "./styled";

const Consent = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  if (!data) {
    onModalClose();
    return null;
  }

  const { confirmData } = data;
  if (!confirmData) {
    onModalClose();
    return null;
  }

  const onConfirm = () => {
    onModalClose();
    dispatch(confirmData);
  };

  const onTermToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Wrapper width="488px">
      <Title>{t("modal_fast_sign_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Desc>
            <Text
              dangerouslySetInnerHTML={{
                __html: `${t("modal_consent_desc")}`,
              }}
            />
          </Desc>
          <Term>
            <Checkbox isChecked={isChecked} onToggle={onTermToggle} />
            <Label>{t("modal_fast_sign_term")}</Label>
          </Term>

          <Panel>
            <Button
              type={isChecked ? "primaryFlex" : "disabled"}
              handleEvent={isChecked ? onConfirm : null}
            >
              {t("btn_continue")}
            </Button>
          </Panel>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default Consent;
