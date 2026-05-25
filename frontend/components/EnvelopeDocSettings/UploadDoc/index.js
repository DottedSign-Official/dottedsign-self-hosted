import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { uploadFieldStyle } from "../../../constants/constants";

import { setFiles as setFilesAction } from "../../../redux/actions/create";

import Loader from "../../Loaders/ContentDocument";
import ListDocument from "../../../containers/ListDocument";
import Dropzone from "../../../containers/Dropzone";
import Icon from "../../Icon";

import { Title } from "../../../global/styledCreate";
import {
  WrapperUpload,
  WrapperUploadBlock,
  WrapperUploadBtn,
  HintText,
  HintBtn,
} from "./styled";

const UploadDoc = () => {
  const { t } = useTranslation("create");
  const { isLoading, files } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const setFiles = (fls) => dispatch(setFilesAction(fls));
  const [isHint, setIsHint] = useState(true);

  const onUpload = (uploadFiles) => {
    setFiles(uploadFiles.map((f) => f.file));
  };

  const onCloseHint = () => {
    setIsHint(false);
  };

  const isEmpty = !(files && files.length > 0);
  const singleFileSizeLimit = 100000000;
  const allFileSizeLimit = 200000000;

  return (
    <>
      <Title>{t("upload_documents")}</Title>

      {isLoading && isEmpty ? (
        <Loader />
      ) : isEmpty ? (
        <WrapperUpload>
          <WrapperUploadBlock>
            <Dropzone
              allowedFormat="pdf"
              type={uploadFieldStyle.btnOnly}
              setFiles={onUpload}
              singleFileSizeLimit={singleFileSizeLimit}
              allFileSizeLimit={allFileSizeLimit}
              isHint
              isMulti
            />
          </WrapperUploadBlock>
        </WrapperUpload>
      ) : (
        <WrapperUploadBtn>
          <Dropzone
            allowedFormat="pdf"
            type={uploadFieldStyle.btnOnly}
            setFiles={onUpload}
            singleFileSizeLimit={singleFileSizeLimit}
            allFileSizeLimit={allFileSizeLimit}
            isHint={false}
            isMulti
            isContinuousUpload
          />
        </WrapperUploadBtn>
      )}

      {!isEmpty && isHint && (
        <HintText>
          <Icon type="exclamation" />
          <p>{t("envelope_files_upload_hint")}</p>
          <HintBtn onClick={onCloseHint}>{t("got_it")}</HintBtn>
        </HintText>
      )}

      {files && files.length > 0 && <ListDocument isEnvelope />}
    </>
  );
};

export default UploadDoc;
