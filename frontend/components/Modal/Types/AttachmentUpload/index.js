import React, { useRef, useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../../redux/actions/common";
import { setAttachmentsUploaded as setAttachmentsUploadedAction } from "../../../../redux/actions/sign";
import {
  uploadFieldStyle,
  MODAL_TYPE,
  uploadFormat,
} from "../../../../constants/constants";
import Dropzone from "../../../../containers/Dropzone";
import Icon from "../../../Icon";
import Button from "../../../Button";
import FileIcon from "./FileIcon";
import { fileTypes } from "./data";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import {
  Hint,
  WrapperAttachment,
  Label,
  File,
  Preview,
  Name,
  Del,
} from "./styled";

const AttachmentUpload = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const refAtt = useRef([]);

  const { attachments, reviewResults, isEnvelope, fileFocus } = useSelector(
    (state) => state.sign,
  );
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setAttachmentsUploaded = (data) => {
    dispatch(setAttachmentsUploadedAction(data));
  };
  const { reviewed_attachments } = reviewResults || {};
  const isModifying = !!reviewResults && reviewed_attachments?.length > 0;

  useEffect(() => {
    refAtt.current = attachments;
  }, [attachments]);

  const attachmentList = useMemo(() => {
    const reviewedAttachmentsMap = new Map(
      reviewed_attachments?.map((atta) => [atta.attachment_id, atta]) || [],
    );
    return attachments.map((atta) => {
      const attachmentId = atta.attachment_id;
      const reviewedAttachment = reviewedAttachmentsMap.get(attachmentId);
      return {
        ...atta,
        accepted: reviewedAttachment?.accepted,
      };
    });
  }, [attachments, reviewed_attachments]);

  const isInValid = isEnvelope
    ? attachments.filter(
        (atta) =>
          atta.envelope_file_id === fileFocus.fileId &&
          atta.force &&
          !atta.file,
      ).length > 0
    : attachments.filter((atta) => atta.force && !atta.file).length > 0;

  const onUpload = (atta) => (files) => {
    if (!files || files.length < 1) {
      return;
    }

    const newFile = {
      ...atta,
      isUploaded: false,
      preview: files[0].preview,
      file: files[0].file,
      changed: true,
    };

    const myAttachments = refAtt.current;
    const res = myAttachments
      ? myAttachments.filter(
          (att) => att.attachment_id !== newFile.attachment_id,
        )
      : [];

    let newAtta = [...res, newFile];
    newAtta.sort((a, b) => a.attachment_id.localeCompare(b.attachment_id));

    setAttachmentsUploaded(newAtta);
  };

  const onRemove = (atta) => {
    const newFile = {
      ...atta,
      file: null,
      changed: true,
    };
    const res = attachments.filter(
      (att) => att.attachment_id !== atta.attachment_id,
    );

    let newAtta = [...res, newFile];
    newAtta.sort((a, b) => a.attachment_id.localeCompare(b.attachment_id));

    setAttachmentsUploaded(newAtta);
  };

  const onConfirm = () => {
    if (isEnvelope) {
      onModalClose();
      return;
    }
    openModal({ modalType: MODAL_TYPE.signhereConfirm });
  };

  const customAllowedFormat = {
    list: [
      ...uploadFormat.all.list,
      fileTypes.gif,
      fileTypes.docx,
      fileTypes.docxOpenXML,
      fileTypes.pptx,
      fileTypes.xlsx,
      fileTypes.xls,
      fileTypes.dot,
      fileTypes.zip,
      fileTypes.xZip,
      fileTypes.zipMime,
      fileTypes.rarMime,
      fileTypes.rarExt,
      fileTypes.sevenZMime,
      fileTypes.sevenZExt,
    ],
    fileType: [
      ...uploadFormat.all.fileType,
      fileTypes.gif,
      fileTypes.docx,
      fileTypes.docxOpenXML,
      fileTypes.pptx,
      fileTypes.xlsx,
      fileTypes.xls,
      fileTypes.dot,
      fileTypes.zip,
      fileTypes.xZip,
      fileTypes.zipMime,
      fileTypes.rarMime,
      fileTypes.rarExt,
      fileTypes.sevenZMime,
      fileTypes.sevenZExt,
    ],
    error: "commonFormatError",
  };

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_attachment_upload_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Hint>
            <Icon type="tips" size="20px" />
            <p>{t("modal_attachment_upload_desc")}</p>
          </Hint>

          {attachmentList.map((atta, idx) => {
            if (isEnvelope && atta.envelope_file_id !== fileFocus.fileId) {
              return null;
            }

            return (
              <WrapperAttachment key={idx}>
                <Label>
                  {isModifying && (
                    <Icon
                      type={atta.accepted ? "acceptedCircle" : "refusedCircle"}
                      size="16px"
                    />
                  )}
                  <b>{atta.file_name}</b>
                  {t(atta.force ? "required" : "optional")}
                </Label>
                {atta.file ? (
                  <File>
                    <Preview>
                      {atta.preview ? (
                        <img src={atta.preview} alt="attachment-preview" />
                      ) : atta.thumbnail ? (
                        <img src={atta.thumbnail} alt="attachment-thumbnail" />
                      ) : (
                        <FileIcon type={atta.file?.type} />
                      )}
                    </Preview>
                    <Name>{atta.file.name}</Name>
                    <Del onClick={() => onRemove(atta)}>
                      <Icon type="cancel" size="16px" />
                    </Del>
                  </File>
                ) : (
                  <Dropzone
                    type={uploadFieldStyle.textOnly}
                    customAllowedFormat={customAllowedFormat}
                    setFiles={onUpload(atta)}
                  />
                )}
              </WrapperAttachment>
            );
          })}
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isInValid ? "disabled" : "primaryFlex"}
          handleEvent={isInValid ? null : onConfirm}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default AttachmentUpload;
