import React from "react";
import { useTranslation } from "next-i18next";
import Badge from "../Badge";
import {
  Wrapper,
  Body,
  Title,
  Desc,
  Panel,
  Divider,
  Illustrate,
} from "./styled";

const CoverDownloadApp = () => {
  const { t } = useTranslation("cover");
  return (
    <Wrapper>
      <Body>
        <Title>{t("download_app_title")}</Title>
        <Desc>{t("download_app_desc")}</Desc>
        <Panel>
          <Badge platform="ios" />
          <Divider />
          <Badge platform="android" />
        </Panel>
      </Body>
      <Illustrate src="/static/images/group-4.png" alt="image-sign" />
    </Wrapper>
  );
};

export default CoverDownloadApp;
