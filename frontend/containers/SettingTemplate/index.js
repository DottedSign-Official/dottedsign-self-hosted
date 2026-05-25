import React from "react";
import { useTranslation } from "next-i18next";
import Loader from "../../components/Loaders/Label";
import SelectionTemplate from "../SelectionTemplate";
import {
  ContentBlock,
  Label,
  ContentBlockSub,
} from "../../global/styledSettings";

const TemplateContainer = ({ isPlaceholder }) => {
  const { t } = useTranslation("settings");

  return (
    <ContentBlock>
      {isPlaceholder ? <Loader /> : <Label>{t("label_template")}</Label>}
      <ContentBlockSub>
        <SelectionTemplate isManageable />
      </ContentBlockSub>
    </ContentBlock>
  );
};

export default TemplateContainer;
