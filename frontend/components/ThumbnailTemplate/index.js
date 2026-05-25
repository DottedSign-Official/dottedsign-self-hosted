import React from "react";
import { useTranslation } from "next-i18next";
import { WrapperList } from "../../global/styledCreate";
import { Content, Thumbnail, Name } from "./styled";

const ThumbnailTemplate = ({ thumbnail, name }) => {
  const { t } = useTranslation("common");

  return (
    <WrapperList>
      <Content>
        <Thumbnail src={thumbnail} alt="thumbnail-template" />
        <Name>
          <b>{name}</b>
          <p>{`[${t("template")}]`}</p>
        </Name>
      </Content>
    </WrapperList>
  );
};

export default ThumbnailTemplate;
