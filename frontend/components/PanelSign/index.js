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
  WrapperApply,
  Body,
} from "../../global/styledPanel";

import { WrapperMode, TabMode } from "./styled";

const Panel = ({
  modes,
  modeComponents,
  mode,
  focus,
  onModeChange,
  onPanelClose,
  onConfirm,
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

            <WrapperMode>
              {modes.map((mod) => (
                <TabMode
                  key={mod.idx}
                  isActive={mod.key === mode}
                  onClick={() => onModeChange(mod.key)}
                >
                  {t(mod.text)}
                </TabMode>
              ))}
            </WrapperMode>

            {focus && (
              <WrapperApply>
                <Btn type="primaryFlex" handleEvent={onConfirm}>
                  {t("btn_apply")}
                </Btn>
              </WrapperApply>
            )}
          </Header>

          <Body id="signBox">{modeComponents[mode]}</Body>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default Panel;
