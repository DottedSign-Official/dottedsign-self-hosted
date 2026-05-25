import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { openModal as openModalAction } from "../../redux/actions/common";
import {
  setFiles as setFilesAction,
  setTmpFiles as setTmpFilesAction,
  setThumbnail as setThumbnailAction,
} from "../../redux/actions/create";
import { openToast as openToastAction } from "../../redux/actions/common";

import { MODAL_TYPE } from "../../constants/constants";
import toastType from "../../constants/toast";
import ContentDocument from "../../components/ContentDocument";

import { getPDFPageNum, getPDFSize } from "../../helpers/others";

const ContentDocumentContainer = ({ isTemplate, isTemplateOnly }) => {
  const {
    isLoading,
    templateId,
    fileUrl,
    files,
    thumbnail,
    templatePages,
    fileName,
  } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setFiles = (fls) => dispatch(setFilesAction(fls));
  const setTmpFiles = (fls) => dispatch(setTmpFilesAction(fls));
  const setThumbnail = (data) => dispatch(setThumbnailAction(data));
  const openToast = (data) => dispatch(openToastAction(data));

  const onTemplateModalOpen = () => {
    openModal({ modalType: MODAL_TYPE.templateSelection });
  };

  const onUpload = (files) => {
    setFiles([files[0].file]);
    setTmpFiles([files[0].file]);
  };

  const onReplaceDocument = async (newFiles) => {
    const newFileUrl = URL.createObjectURL(newFiles[0].file);
    const newPageNum = await getPDFPageNum(newFileUrl);

    const originalSize = await getPDFSize(fileUrl, 1);
    const newSize = await getPDFSize(newFileUrl, 1);

    // NOTE: check page numbers
    if (!newPageNum || newPageNum < templatePages) {
      openToast({ payload: toastType.lessThanTemplatePages });
      return;
    }

    // NOTE: check pdf size
    if (
      newSize.width !== originalSize.width ||
      newSize.height !== originalSize.height
    ) {
      openToast({ payload: toastType.sizeMismatch });
      return;
    }

    const newFileWithOriginalName = new File([newFiles[0].file], fileName, {
      type: newFiles[0].file.type,
    });

    setFiles([newFileWithOriginalName]);
    setThumbnail(null);
  };

  return (
    <ContentDocument
      isLoading={isLoading}
      isPurchased
      isTemplate={isTemplate}
      isTemplateOnly={isTemplateOnly}
      templateId={templateId}
      fileUrl={fileUrl}
      files={files}
      thumbnail={thumbnail}
      onUpload={onUpload}
      onReplaceDocument={onReplaceDocument}
      onTemplateModalOpen={onTemplateModalOpen}
    />
  );
};

export default ContentDocumentContainer;
