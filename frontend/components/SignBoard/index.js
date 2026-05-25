import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import scrollLock from "../../helpers/scrollLock";
import { SIGN_COLOR_TAG } from "../../constants/constants";
import WindowWidth from "../../containers/WindowWidth";
import TabSwitch from "../TabSwitch";
import Icon from "../Icon";
import Tooltip from "../../containers/Tooltip";
import tooltip from "../../constants/tooltip";
import ButtonWithLoading from "../ButtonWithLoading";
import MyCanvas from "./Board";
import {
  Wrapper,
  WrapperInner,
  Header,
  Title,
  BtnClose,
  Body,
  Content,
  Panel,
  Plate,
  PlateCircle,
  BtnClear,
} from "./styled";
import {
  SignBoardWithQRcode,
  QRcodeButton,
} from "../../containers/SignBoardWithQRcode";

const Signboard = ({
  isMobile,
  refCanvas,
  id,
  modes,
  category,
  currentMode,
  color,
  isValid,
  isProcessing,
  isPhotoSignature,
  onClose,
  onModeChange,
  onSetColor,
  onStart,
  onStop,
  onClear,
  onExport,
  windowWidth,
}) => {
  const { t } = useTranslation("settings");
  const { isLoading } = useSelector((state) => state.sign);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLandscape(windowWidth > window.innerHeight);
    }
  }, [windowWidth]);

  scrollLock({ targetId: "signBoard" });

  const content = () => {
    const buttonType = (() => {
      if (!isValid || isProcessing) {
        return "disabled";
      }
      return "primary";
    })();

    const buttonEvent = (() => {
      if (!isValid || isProcessing) {
        return null;
      }
      return onExport;
    })();

    return (
      <SignBoardWithQRcode onClose={onClose} category={category}>
        <Body isMobile={isMobile} isLandscape={isLandscape}>
          {!isMobile && !isPhotoSignature && (
            <QRcodeButton>
              <Content>
                <Icon type="qrcode" />
                <p>{t("mobile-sign-panel")}</p>
              </Content>
              <Tooltip
                type={tooltip.mobileSignPanel}
                theme="normal"
                position="top"
              />
            </QRcodeButton>
          )}
          <MyCanvas
            color={color}
            refCanvas={refCanvas}
            onStart={onStart}
            onStop={onStop}
            isLandscape={isLandscape}
            onClear={onClear}
          />
        </Body>

        <Panel isMobile={isMobile} isLandscape={isLandscape}>
          <Plate>
            <BtnClear onClick={onClear}>{t("clear")}</BtnClear>
            {SIGN_COLOR_TAG.map((colorTag, idx) => (
              <PlateCircle
                key={idx}
                data-color={colorTag}
                isActive={color === colorTag}
                onClick={() => onSetColor(colorTag)}
              />
            ))}
          </Plate>

          <ButtonWithLoading
            isLoading={isLoading || isProcessing}
            id={isValid ? id : ""}
            type={buttonType}
            handleEvent={buttonEvent}
          >
            <p>{t("save")}</p>
          </ButtonWithLoading>
        </Panel>
      </SignBoardWithQRcode>
    );
  };

  return (
    <Wrapper id="signBoard" isMobile={isMobile} isLandscape={isLandscape}>
      <WrapperInner isMobile={isMobile}>
        <Header>
          <>&nbsp;</>
          {currentMode && modes ? (
            <TabSwitch
              tab={currentMode}
              tabs={modes}
              onTabChange={onModeChange}
            />
          ) : (
            <Title>
              {t(isMobile ? "mobile_sign_panel_title" : "signboard_title")}
            </Title>
          )}

          {onClose ? (
            <BtnClose
              src="/static/icons/cancel_ic.svg"
              alt="icon-close"
              onClick={onClose}
            />
          ) : (
            <>&nbsp;</>
          )}
        </Header>
        {content()}
      </WrapperInner>
    </Wrapper>
  );
};

export default WindowWidth(Signboard);
