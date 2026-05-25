import React from "react";
import { useTranslation } from "next-i18next";
import CollapseContent from "../../containers/CollapseContent";
import ListUploadDocumentView from "../ListUploadDocumentView";
import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
  BtnAdd,
} from "../../global/styledCreate";

const childHead = ({ t, isViewOnly, onEdit }) => (
  <TitleFieldBlock>
    <FieldName>{t("upload_documents")}</FieldName>
    {!isViewOnly && (
      <BtnAdd id="Assign-Fields-Edit-GetSignatures" onClick={onEdit}>
        {t("btn_edit")}
      </BtnAdd>
    )}
  </TitleFieldBlock>
);

const childBody = ({ files }) => (
  <>
    <ListUploadDocumentView files={files} />
  </>
);

const EditUploadDocument = ({ isViewOnly, files, onEdit }) => {
  const { t } = useTranslation("create");
  return (
    <WrapperFieldBlock>
      <CollapseContent
        childHead={childHead({ t, isViewOnly, onEdit })}
        childBody={childBody({ files })}
      />
    </WrapperFieldBlock>
  );
};

export default EditUploadDocument;
