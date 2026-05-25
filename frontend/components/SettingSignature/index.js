import React from "react";
import { useTranslation } from "next-i18next";
import MySigns from "../../containers/MySigns";
import MyStamps from "../../containers/MyStamps";
import Loader from "../Loaders/Label";
import {
  ContentBlock,
  Label,
  ContentBlockSub,
  LabelSub,
} from "../../global/styledSettings";
import { WrapperSign } from "./styled";

const SettingSign = ({ isPlaceholder }) => {
  const { t } = useTranslation("settings");
  return (
    <ContentBlock>
      {isPlaceholder ? <Loader /> : <Label>{t("label_signature")}</Label>}
      <ContentBlockSub>
        {isPlaceholder ? <Loader /> : <LabelSub>{t("label_script")}</LabelSub>}
        <WrapperSign>
          <MySigns />
        </WrapperSign>
      </ContentBlockSub>
      <ContentBlockSub>
        {isPlaceholder ? <Loader /> : <LabelSub>{t("label_image")}</LabelSub>}
        <MyStamps />
      </ContentBlockSub>
    </ContentBlock>
  );
};

export default SettingSign;
