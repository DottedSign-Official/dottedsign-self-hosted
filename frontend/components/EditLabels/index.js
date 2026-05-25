import React from "react";
import { useTranslation } from "next-i18next";
import CollapseContent from "../../containers/CollapseContent";
import SelectLabels from "../../containers/SelectLabels";
import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
} from "../../global/styledCreate";
import { WrapperLabels } from "./styled";

const childHead = ({ t }) => (
  <TitleFieldBlock>
    <FieldName>{t("label_field")}</FieldName>
  </TitleFieldBlock>
);

const childBody = ({ labelsSelected, onUpdate }) => (
  <WrapperLabels>
    <SelectLabels
      optionsActive={labelsSelected}
      onUpdate={onUpdate}
      target="template"
      isUpward
    />
  </WrapperLabels>
);

const EditLabels = ({ labelsSelected, onUpdate }) => {
  const { t } = useTranslation("create");
  return (
    <WrapperFieldBlock>
      <CollapseContent
        childHead={childHead({ t })}
        childBody={childBody({ labelsSelected, onUpdate })}
      />
    </WrapperFieldBlock>
  );
};

export default EditLabels;
