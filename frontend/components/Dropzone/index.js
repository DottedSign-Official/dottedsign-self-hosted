import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "next-i18next";
import { uploadFieldStyle } from "../../constants/constants";
import { Divider } from "../../global/styled";
import { Wrapper, PlaceHolder, Button, Text, Hint } from "./styled";

const DropzoneComponent = ({
  id,
  type,
  isHint,
  accept,
  isMulti,
  isContinuousUpload,
  btnText,
  hintText,
  onDropEvent,
}) => {
  const { t } = useTranslation("create");

  const { files } = useSelector((state) => state.create);

  const onDrop = useCallback(
    (acceptedFiles) => {
      onDropEvent(isContinuousUpload, files, acceptedFiles);
    },
    [onDropEvent, isContinuousUpload, files],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple: isMulti ? true : false,
    onDrop,
  });

  let isBtn, isWrapperPadding, isPlaceholderPadding, isBack;

  switch (type) {
    case uploadFieldStyle.textOnly:
      isWrapperPadding = true;
      break;

    case uploadFieldStyle.btnOnly:
      isBtn = true;
      break;

    case uploadFieldStyle.btnWithBack:
      isBtn = true;
      isWrapperPadding = true;
      isPlaceholderPadding = true;
      isBack = true;
      break;

    case uploadFieldStyle.textWithBack:
      isWrapperPadding = true;
      isPlaceholderPadding = true;
      isBack = true;
      break;

    default:
      break;
  }

  return (
    <Wrapper {...getRootProps()} isPadding={isWrapperPadding} isBack={isBack}>
      <input {...getInputProps()} />
      <PlaceHolder isPadding={isPlaceholderPadding}>
        {isBtn ? (
          <Button id={id}>{btnText ? btnText : t("btn_upload")}</Button>
        ) : (
          <Text>{btnText ? btnText : t("btn_upload")}</Text>
        )}

        {isHint && (
          <>
            <Divider />
            <Hint
              dangerouslySetInnerHTML={{
                __html: hintText ? hintText : t("upload_hint"),
              }}
            />
          </>
        )}
      </PlaceHolder>
    </Wrapper>
  );
};

export default DropzoneComponent;
