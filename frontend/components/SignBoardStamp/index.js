import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import scrollLock from "../../helpers/scrollLock";
import { getImageFormat } from "../../helpers/image";
import { uploadFieldStyle } from "../../constants/constants";
import Dropzone from "../../containers/Dropzone";
import TabSwitch from "../TabSwitch";
import {
  Wrapper,
  WrapperInner,
  Header,
  BtnClose,
  Body,
  Content,
  WrapperUpload,
  Preview,
  Panel,
  Btn,
} from "./styled";

const Signboard = ({
  isLoading,
  idUpload,
  idSave,
  onClose,
  onSignSave,
  modes,
  currentMode,
  onModeChange,
}) => {
  const { t } = useTranslation("settings");

  const [fileObj, setFileObj] = useState(null);
  const isValid = !isLoading && fileObj && fileObj.raw;
  scrollLock({ targetId: "signBoard" });

  const onUpload = (files) => {
    const fileObj = files[0];

    setFileObj(fileObj);
  };

  const onClear = () => {
    setFileObj(null);
  };

  const onExport = () => {
    if (isValid) {
      onSignSave(
        { raw: fileObj.raw },
        getImageFormat(fileObj.file.type),
        "stamp",
      );
    }
  };

  return (
    <Wrapper id="signBoard">
      <WrapperInner>
        <Header>
          {currentMode && modes && (
            <>
              <div />
              <TabSwitch
                tab={currentMode}
                tabs={modes}
                onTabChange={onModeChange}
              />
            </>
          )}

          {onClose && !isLoading ? (
            <BtnClose
              src="/static/icons/cancel_ic.svg"
              alt="icon-close"
              onClick={onClose}
            />
          ) : (
            <>&nbsp;</>
          )}
        </Header>

        <Body>
          <Content>
            {fileObj && fileObj.preview ? (
              <Preview src={fileObj.preview} alt="upload-preview" />
            ) : (
              <WrapperUpload>
                <Dropzone
                  id={idUpload ? idUpload : "btn-stamp-upload"}
                  type={uploadFieldStyle.textOnly}
                  allowedFormat={"image"}
                  setFiles={onUpload}
                />
              </WrapperUpload>
            )}
          </Content>
        </Body>

        <Panel>
          <Btn
            isData={isValid}
            onClick={isValid ? onClear : () => {}}
            isInverse
          >
            <p>{t("clear")}</p>
          </Btn>
          <Btn
            id={isValid ? (idSave ? idSave : "btn-stamp-save") : null}
            isData={isValid}
            onClick={isValid ? onExport : null}
          >
            <p>{t("save")}</p>
          </Btn>
        </Panel>
      </WrapperInner>
    </Wrapper>
  );
};

export default Signboard;
