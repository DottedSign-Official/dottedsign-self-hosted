import React from "react";
import { useTranslation } from "next-i18next";
import {
  CameraContainer,
  Video,
  Overlay,
  Message,
  LoadingSpinner,
} from "./styled";

const CameraFaceBox = ({ videoRef, isLoading, error }) => {
  const { t } = useTranslation("settings");

  const getOverlayMessage = () => {
    if (isLoading) {
      return null;
    }
    if (error) {
      return t(error);
    }
    return null;
  };

  const isOverlay = isLoading || error;
  const overlayMessage = getOverlayMessage();

  return (
    <CameraContainer>
      <Video ref={videoRef} autoPlay muted playsInline />

      {isLoading && <LoadingSpinner />}

      {isOverlay && overlayMessage && (
        <Overlay>
          <Message>{overlayMessage}</Message>
        </Overlay>
      )}
    </CameraContainer>
  );
};

export default CameraFaceBox;
