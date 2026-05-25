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

import { WrapperItemDate, ItemDate } from "./styled";

const PanelDate = ({
  selections,
  focus,
  onSelect,
  onConfirm,
  onPanelClose,
}) => {
  const { t } = useTranslation("common");
  return (
    <Portal>
      <Wrapper>
        <WrapperInner>
          <Header>
            <WrapperClose onClick={onPanelClose}>
              <Icon type="cancel" />
            </WrapperClose>

            <Title>{t("panel_date_title")}</Title>

            {focus && (
              <WrapperApply>
                <Btn type="primaryFlex" handleEvent={onConfirm}>
                  {t("btn_apply")}
                </Btn>
              </WrapperApply>
            )}
          </Header>

          <Body id="dateBox">
            <WrapperItemDate>
              {selections.map((sel, id) => (
                <ItemDate
                  key={id}
                  isFocus={focus && focus.format === sel.format}
                  onClick={() => onSelect(id)}
                >
                  {sel.text}
                </ItemDate>
              ))}
            </WrapperItemDate>
          </Body>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default PanelDate;
