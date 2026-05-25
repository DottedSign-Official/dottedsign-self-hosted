import React from "react";
import { useTranslation } from "next-i18next";
import Loader from "../Loaders/ContentDocument";
import Btn from "../Button";
import { uploadFieldStyle } from "../../constants/constants";
import ListDocument from "../../containers/ListDocument";
import ThumbnailTemplate from "../../containers/ThumbnailTemplate";
import Dropzone from "../../containers/Dropzone";
import { Title } from "../../global/styledCreate";
import { WrapperUpload, WrapperUploadBlock, Or } from "./styled";

const PDF_SIZE_LIMIT = 100e6;
const ContentDocument = ({
  isLoading,
  isTemplate,
  isTemplateOnly,
  templateId,
  files,
  fileUrl,
  thumbnail,
  onUpload,
  onReplaceDocument,
  onTemplateModalOpen,
}) => {
  const { t } = useTranslation("create");
  const isEmpty = !(files && files.length > 0) && !(fileUrl && templateId);

  return (
    <React.Fragment>
      <Title>
        {t(isTemplateOnly ? "select_template" : "upload_documents")}
      </Title>
      {isEmpty &&
        (isLoading ? (
          <Loader />
        ) : (
          <WrapperUpload>
            {!isTemplateOnly && (
              <WrapperUploadBlock>
                <Dropzone
                  allowedFormat="pdf"
                  type={uploadFieldStyle.btnOnly}
                  setFiles={onUpload}
                  singleFileSizeLimit={PDF_SIZE_LIMIT}
                  isHint
                />
              </WrapperUploadBlock>
            )}

            {isTemplate && !isTemplateOnly && (
              <Or>
                <p>{t("or")}</p>
              </Or>
            )}

            {(isTemplate || isTemplateOnly) && (
              <WrapperUploadBlock>
                <Btn
                  id="GetSignatures_Templates_Upgrade"
                  type="upload"
                  handleEvent={onTemplateModalOpen}
                >
                  {t("btn_template")}
                </Btn>
              </WrapperUploadBlock>
            )}
          </WrapperUpload>
        ))}

      {files?.length > 0 && <ListDocument />}

      {templateId && thumbnail && <ThumbnailTemplate />}

      {templateId && (
        <Dropzone
          allowedFormat="pdf"
          singleFileSizeLimit={PDF_SIZE_LIMIT}
          setFiles={onReplaceDocument}
          type={uploadFieldStyle.btnOnly}
          btnText={t("btn_replace_document")}
        />
      )}
    </React.Fragment>
  );
};

export default ContentDocument;
