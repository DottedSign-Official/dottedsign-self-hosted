import React, { useState } from "react";
import uuid from "uuid/v1";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setAttachments as setAttachmentsAction } from "../../../../redux/actions/create";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Checkbox from "../../../Checkbox";
import SelectAssignes from "../../../../containers/SelectAssignes";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Block, Label, Name, Item, ChkboxHint } from "./styled";

const AttachmentField = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [signerFocus, setSignerFocus] = useState(null);
  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [isViewable, setIsViewable] = useState(true);

  const { attachments, isEnvelope, fileFocus } = useSelector(
    (state) => state.create,
  );
  const dispatch = useDispatch();
  const setAttachments = (data) => dispatch(setAttachmentsAction(data));

  const isValid = name && name !== "" && signerFocus;

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onIsRequiredToggle = () => {
    setIsRequired(!isRequired);
  };

  const onIsViewableToggle = () => {
    setIsViewable(!isViewable);
  };

  const onConfirm = () => {
    if (!isValid) {
      return null;
    }

    const itemAttachment = {
      attachment_id: uuid(),
      signer: signerFocus,
      file_name: name,
      force: isRequired,
      viewable_in_processing: isViewable,
      ...(isEnvelope && { envelope_file_id: fileFocus.fileId }),
    };

    let attachmentsOri = attachments ? attachments : [];
    setAttachments({
      attachments: [...attachmentsOri, itemAttachment],
      isModal: true,
    });
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_attachment_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Block>
            <Label>{t("signer")}</Label>
            <SelectAssignes
              assigneFocusLocal={signerFocus}
              setAssigneFocusLocal={setSignerFocus}
              isLocal
            />
          </Block>
          <Block>
            <Label>{t("file_hint")}</Label>
            <Name onChange={onNameChange} placeholder={t("file_placeholder")} />
          </Block>
          <Block>
            <Label>{t("is_required")}</Label>
            <Item>
              <Checkbox isChecked={isRequired} onToggle={onIsRequiredToggle} />
              <ChkboxHint>{t("is_required_file")}</ChkboxHint>
            </Item>
          </Block>
          <Block>
            <Label>{t("is_downloaded")}</Label>
            <Item>
              <Checkbox isChecked={isViewable} onToggle={onIsViewableToggle} />
              <ChkboxHint>{t("is_downloaded_file")}</ChkboxHint>
            </Item>
          </Block>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isValid ? "primaryFlex" : "disabled"}
          handleEvent={isValid && onConfirm}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default AttachmentField;
