import React from "react";
import { useTranslation } from "next-i18next";
import Portal from "../Portal";
import Icon from "../Icon";
import Btn from "../Button";
import {
  Wrapper,
  WrapperInner,
  Header,
  WrapperClose,
  Title,
  WrapperApply,
  Body,
} from "../../global/styledPanel";
import { Input } from "../../global/styledForm";
import { WrapperInput, Warn } from "./styled";

const PanelText = ({
  isValid,
  onChange,
  onKeyDown,
  onConfirm,
  onPanelClose,
}) => {
  const { t } = useTranslation(["common"]);
  return (
    <Portal>
      <Wrapper>
        <WrapperInner>
          <Header>
            <WrapperClose onClick={onPanelClose}>
              <Icon type="cancel" />
            </WrapperClose>

            <Title>{t("input_link", { ns: "create" })}</Title>

            <WrapperApply>
              <Btn
                type={isValid ? "primaryFlex" : "disabled"}
                handleEvent={isValid ? onConfirm : null}
              >
                {t("btn_apply")}
              </Btn>
            </WrapperApply>
          </Header>

          <Body id="textBox">
            <WrapperInput>
              <Input
                onKeyDown={onKeyDown}
                onChange={onChange}
                placeholder={t("input_placeholder")}
              />
              {!isValid && <Warn>{t("link_error_validate")}</Warn>}
            </WrapperInput>
          </Body>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default PanelText;
