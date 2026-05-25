import React from "react";
import { useTranslation } from "next-i18next";
import CollapseContent from "../../containers/CollapseContent";
import ListAssignesView from "../ListAssignesView";
import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
  BtnAdd,
} from "../../global/styledCreate";

const childHead = ({ t, isViewOnly, onEdit }) => (
  <TitleFieldBlock>
    <FieldName>{t("signers")}</FieldName>
    {!isViewOnly && (
      <BtnAdd id="Assign-Fields-Edit-GetSignatures" onClick={onEdit}>
        {t("btn_edit")}
      </BtnAdd>
    )}
  </TitleFieldBlock>
);

const childBody = ({ isTemplate, assignes }) => (
  <ListAssignesView isTemplate={isTemplate} assignes={assignes} isMini />
);

const EditAssignes = ({ isViewOnly, isTemplate, assignes, onEdit }) => {
  const { t } = useTranslation("create");
  return (
    <WrapperFieldBlock>
      <CollapseContent
        childHead={childHead({ t, isViewOnly, onEdit })}
        childBody={childBody({ isTemplate, assignes })}
      />
    </WrapperFieldBlock>
  );
};

export default EditAssignes;
