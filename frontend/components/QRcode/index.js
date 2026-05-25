import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Animate from "../Animate";
import loadingAnimation from "../../static/animation/loading.json";
import { Wrapper, Outer, Content } from "./styled";
import WindowWidth from "../../containers/WindowWidth";

const Code = WindowWidth(
  ({ t, isMobile, isFastSigning, isLoading, qrcodeURL }) => {
    const refCanvas = useRef(null);

    useEffect(() => {
      if (qrcodeURL && refCanvas.current) {
        QRCode.toCanvas(
          qrcodeURL,
          { errorCorrectionLevel: "H", width: isFastSigning ? 160 : 200 },
          function (err, canvas) {
            if (err) {
              throw err;
            }

            refCanvas.current.appendChild(canvas);

            // NOTE: add logo
            if (refCanvas.current) {
              const imgDim = { width: 30, height: 30 };
              const context = canvas.getContext("2d");
              const imageObj = new Image();
              imageObj.src = "/static/icons/img-qrcode-logo.svg";
              imageObj.onload = () => {
                context.drawImage(
                  imageObj,
                  canvas.width / 2 - imgDim.width / 2,
                  canvas.height / 2 - imgDim.height / 2,
                  imgDim.width,
                  imgDim.height,
                );
              };
            }
          },
        );
      }
    }, [qrcodeURL, isFastSigning]);

    const content = (() => {
      if (isLoading) {
        return <Animate animationData={loadingAnimation} />;
      }
      return <div ref={refCanvas} id="qrcode-canvas"></div>;
    })();

    return (
      <Wrapper isMobile={isMobile}>
        <Outer isFastSigning={isFastSigning}>{content}</Outer>
        <Content>{t("scan-qrcode-for-mobile-sign-panel")}</Content>
      </Wrapper>
    );
  },
);

export default Code;
