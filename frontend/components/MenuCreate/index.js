import React from "react";
import { useTranslation } from "next-i18next";
import InputSwitch from "../../containers/InputSwitch";
import ButtonWithLoading from "../ButtonWithLoading";
import Button from "../Button";
import { DividerBtn } from "../../global/styled";
import { Wrapper, Title, Default, Panel } from "./styled";

const NameInput = React.memo(
  ({
    currentRouterType,
    envelopeName,
    fileFocus,
    fileList,
    setFileList,
    setFileFocus,
    fileName,
    setFileName,
  }) => {
    if (currentRouterType === "envelope_prepare") {
      return <Default>{envelopeName}</Default>;
    }
    if (currentRouterType === "envelope_assign") {
      return (
        <InputSwitch
          value={fileFocus?.fileName}
          onSubmit={null}
          isBlankProhibit
          fileList={fileList}
          setFileList={setFileList}
          fileFocus={fileFocus}
          setFileFocus={setFileFocus}
          isEnvelopeAssign
        />
      );
    }
    return (
      <InputSwitch value={fileName} onSubmit={setFileName} isBlankProhibit />
    );
  },
);
NameInput.displayName = "NameInput";

const MenuCreate = ({
  isLoading,
  isViewOnly,
  currentRouterType,
  envelopeName,
  fileName,
  setFileName,
  fileList,
  setFileList,
  setFileFocus,
  fileFocus,
  onNext,
  onCancel,
  onBackSettings,
}) => {
  const { t } = useTranslation("create");

  const NameDisplay = () => {
    if (currentRouterType === "envelope_prepare") {
      return <Default>{envelopeName}</Default>;
    }
    if (currentRouterType === "envelope_assign") {
      return <Default>{fileFocus?.fileName}</Default>;
    }
    return <Default>{fileName}</Default>;
  };

  return (
    <Wrapper>
      <Title>
        {isViewOnly ? (
          <NameDisplay />
        ) : (
          <NameInput
            currentRouterType={currentRouterType}
            envelopeName={envelopeName}
            fileFocus={fileFocus}
            fileList={fileList}
            setFileList={setFileList}
            setFileFocus={setFileFocus}
            fileName={fileName}
            setFileName={setFileName}
          />
        )}
      </Title>
      <Panel>
        {isViewOnly ? (
          <Button type="cancel" handleEvent={onBackSettings}>
            {t("btn_back")}
          </Button>
        ) : (
          <>
            <ButtonWithLoading
              isLoading={isLoading}
              type="cancel"
              handleEvent={onCancel}
            >
              {t("btn_cancel")}
            </ButtonWithLoading>
            <DividerBtn />
            <ButtonWithLoading
              isLoading={isLoading}
              type="primary"
              handleEvent={onNext}
            >
              {t("btn_continue")}
            </ButtonWithLoading>
          </>
        )}
      </Panel>
    </Wrapper>
  );
};

export default MenuCreate;
