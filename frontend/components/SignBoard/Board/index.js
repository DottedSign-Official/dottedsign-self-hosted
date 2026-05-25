import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import WindowWidth from "../../../containers/WindowWidth";
import usePenData from "./usePenData";
import canvasSize from "./data";
import { Content, Body, DrawArea, RecordCanvas } from "./styled";

const MyCanvas = ({
  windowWidth,
  color,
  isMobile,
  refCanvas,
  onStart,
  onStop,
  isLandscape,
  onClear,
}) => {
  const refRecordCanvas = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  usePenData(refCanvas);

  useEffect(() => {
    if (!onClear) {
      return;
    }

    const handleOrientationChange = () => onClear();

    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
      return () =>
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange,
        );
    }

    // NOTE:  fallback for old browsers
    window.addEventListener("orientationchange", handleOrientationChange);
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, [onClear]);

  useEffect(() => {
    if (!windowWidth || windowWidth <= 0) {
      return;
    }

    if (isMobile && windowWidth < 768 && isLandscape) {
      setWidth(`${windowWidth - 150}px`);
      setHeight(`${window.innerHeight * 0.5}px`);
    } else if (isMobile && windowWidth < 768) {
      setWidth(`${canvasSize.mobile.width}px`);
      setHeight(`${canvasSize.mobile.height}px`);
    } else {
      setWidth(`${canvasSize.normal.width}px`);
      setHeight(`${canvasSize.normal.height}px`);
    }
  }, [windowWidth, isMobile, isLandscape]);

  useEffect(() => {
    const replaceDataURLBackground = (dataURL) => {
      return new Promise((resolve) => {
        const recordCanvas = refRecordCanvas.current;
        const ctx = recordCanvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, recordCanvas.width, recordCanvas.height);

        const image = new Image();
        image.src = dataURL;
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          resolve(refRecordCanvas.current.toDataURL("image/png"));
        };
      });
    };
    refCanvas.current.replaceDataURLBackground = replaceDataURLBackground;

    const isSizeValid = () => {
      const MIN_SIGNATURE_SIZE = 10;
      const { width, height } = refCanvas.current.getTrimmedCanvas();
      const size = Math.max(width, height);
      return size > MIN_SIGNATURE_SIZE;
    };

    refCanvas.current.isSizeValid = isSizeValid;
  }, [refRecordCanvas, refCanvas, width, height]);

  return (
    <Content isMobile={isMobile}>
      <Body>
        <DrawArea
          isMobile={isMobile}
          onMouseDown={onStart}
          onMouseUp={onStop}
          onMouseLeave={onStop}
          onTouchStart={onStart}
          onTouchEnd={onStop}
          width={width}
          height={height}
        >
          <SignatureCanvas
            ref={refCanvas}
            penColor={color}
            canvasProps={{ width, height }}
          />
          <RecordCanvas
            ref={refRecordCanvas}
            width={width}
            height={height}
            style={{ display: "none" }}
          />
        </DrawArea>
      </Body>
    </Content>
  );
};

export default WindowWidth(MyCanvas);
