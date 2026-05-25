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
import { WrapperItems, DefaultSelection, Item } from "./styled";

const PanelProfile = ({
  focus,
  selections,
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
            <Title>{t("panel_profile_title")}</Title>
            {focus && (
              <WrapperApply>
                <Btn type="primaryFlex" handleEvent={onConfirm}>
                  {t("btn_apply")}
                </Btn>
              </WrapperApply>
            )}
          </Header>
          <Body id="profileBox">
            <WrapperItems>
              {selections && selections.length > 0 ? (
                selections.map((sel, idx) => (
                  <Item
                    key={idx}
                    isFocus={sel === focus}
                    onClick={() => onSelect(sel)}
                  >
                    <span>{sel.value}</span>
                  </Item>
                ))
              ) : (
                <DefaultSelection
                  dangerouslySetInnerHTML={{ __html: t("blank_profile") }}
                />
              )}
            </WrapperItems>
          </Body>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default PanelProfile;
