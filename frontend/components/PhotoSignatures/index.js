import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Container, Empty, PhotoWrapper, Photo } from "./styled";

const PhotoSignatures = () => {
  const { t } = useTranslation("settings");
  const { photoSignatures } = useSelector((state) => state.sign);

  if (photoSignatures.length <= 0) {
    return <Empty>{t("photo_signatures_unavailable")}</Empty>;
  }

  return (
    <Container>
      {photoSignatures.map((signature) => {
        const { url, id } = signature;
        return (
          <PhotoWrapper key={id}>
            <Photo src={url} alt={`signature photo ${id}`} />
          </PhotoWrapper>
        );
      })}
    </Container>
  );
};

export default PhotoSignatures;
