import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import Button from "../../../Button";
import { DividerBtn } from "../../../../global/styled";
import Icon from "../../../Icon";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Panel,
} from "../../../../global/styledModal";
import { hexToRgbArray } from "../../../../helpers/hex2rgba";
import {
  WrapperSetting,
  WrapperEditor,
  WrapperImage,
  Advanced,
} from "./styled";

import ImageProcessingCanvas from "../../../ImageProcessingCanvas";

import EraserSettings from "./EraserSettings";
import ChromaKeySettings from "./ChromaKeySettings";

const ImageProcessing = ({ onModalClose, data }) => {
  const canvasRef = useRef(null);
  const { t } = useTranslation("modal");
  const [collapsed, setCollapsed] = useState(true);
  const [selectedColors, setSelectedColors] = useState(["#ebebeb"]);
  const [threshold, setThreshold] = useState(50);
  const [eraserRadius, setEraserRadius] = useState(0);
  const [isErasing, setIsErasing] = useState(true);
  const { src, onSubmit, onCancel } = data;

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    onSubmit(dataURL);
    onModalClose();
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Wrapper width="700px">
      <Close onClick={handleClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_edit_stamp_board_title")}</Title>
      <Body id="modal-body-scrollable">
        <WrapperEditor>
          <WrapperSetting collapsed={collapsed}>
            <EraserSettings
              t={t}
              radius={eraserRadius}
              isRestore={!isErasing}
              onRadiusChange={setEraserRadius}
              onToggleRestore={() => setIsErasing((prev) => !prev)}
            />
            <ChromaKeySettings
              t={t}
              threshold={threshold}
              selectedColors={selectedColors}
              onThresholdChange={setThreshold}
              onColorsChange={setSelectedColors}
            />
          </WrapperSetting>
          <WrapperImage>
            <ImageProcessingCanvas
              ref={canvasRef}
              imageURL={src}
              colors={selectedColors.map(hexToRgbArray)}
              threshold={threshold}
              eraserRadius={collapsed ? 0 : eraserRadius}
              isErasing={isErasing}
            />
          </WrapperImage>
        </WrapperEditor>
      </Body>
      <Panel>
        <Advanced
          type="primaryFlex"
          handleEvent={() => setCollapsed(!collapsed)}
        >
          {t(collapsed ? "btn_advanced" : "btn_close_advanced")}
        </Advanced>
        <DividerBtn />
        <Button type="cancel" handleEvent={handleClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="primaryFlex" handleEvent={handleSubmit}>
          {t("btn_save")}
        </Button>
      </Panel>
    </Wrapper>
  );
};
export default ImageProcessing;
