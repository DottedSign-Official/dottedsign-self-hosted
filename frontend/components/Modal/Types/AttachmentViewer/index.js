import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { downloadAttachment } from "../../../../redux/actions/sign";
import WindowWidth from "../../../../containers/WindowWidth";
import Icon from "../../../Icon";
import ReviewTooltip from "../../../ReviewTooltip";
import ButtonWithLoading from "../../../ButtonWithLoading";
import { Wrapper, Close, Title, Body } from "../../../../global/styledModal";
import {
  Content,
  File,
  AttachmentWrapper,
  TskName,
  AttaDivider,
} from "./styled";

const AttachmentViewer = ({ onModalClose, isMobile, data }) => {
  const { t } = useTranslation("modal");
  const {
    viewable_attachments,
    reviewedAttachments,
    isEnvelope,
    fileFocus,
    fileList,
  } = data;

  const router = useRouter();
  const { code } = router.query;

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sign);

  const [fileHover, setFileHover] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [sortedAttachments, setSortedAttachments] = useState([]);

  const isReviewing = reviewedAttachments != null;

  useEffect(() => {
    if (!viewable_attachments) {
      return;
    }

    if (reviewedAttachments) {
      const reviewedAttachmentsMap = new Map(
        reviewedAttachments.map((atta) => [atta.attachment_id, atta]),
      );

      const attas = viewable_attachments.map((atta) => {
        const reviewedAtta =
          reviewedAttachmentsMap.get(atta.attachment_id) || {};
        return {
          ...atta,
          isLastTimeChanged: reviewedAtta.isLastTimeChanged,
          isLastTimeFailed: reviewedAtta.isLastTimeFailed,
        };
      });

      setSortedAttachments(attas);
    } else {
      setSortedAttachments(viewable_attachments);
    }
  }, [viewable_attachments, reviewedAttachments]);

  if (!viewable_attachments) {
    return null;
  }

  const fileName = (atta) => {
    if (!atta.file_name && !atta.signer_name) {
      return "File";
    }
    if (!atta.file_name) {
      return `File - ${atta.signer_name}`;
    }
    if (!atta.signer_name) {
      return atta.file_name;
    }

    return `${atta.file_name} - ${atta.signer_name}`;
  };

  const onDownloadAttachment = ({ file_id, file_name }) => {
    setLoadingId(file_id);
    dispatch(downloadAttachment({ isMobile, file_id, file_name, code }));
  };

  return (
    <Wrapper width="580px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_attachment_list")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {isEnvelope &&
            fileList.map((tsk) => {
              const attachments = viewable_attachments.filter(
                (atta) => atta.task_id === tsk.fileId,
              );
              if (attachments.length > 0) {
                return (
                  <React.Fragment key={tsk.fileId}>
                    <TskName focus={tsk.fileId === fileFocus.fileId}>
                      {tsk.fileName}
                    </TskName>
                    <AttaDivider focus={tsk.fileId === fileFocus.fileId} />
                    {attachments.map((atta, idx) => (
                      <AttachmentWrapper key={idx}>
                        <File>{fileName(atta)}</File>
                        <ButtonWithLoading
                          isLoading={isLoading && loadingId === atta.file_id}
                          type="primary"
                          handleEvent={() => onDownloadAttachment(atta)}
                        >
                          {t("btn_download", { ns: "create" })}
                        </ButtonWithLoading>
                      </AttachmentWrapper>
                    ))}
                  </React.Fragment>
                );
              }
            })}
          {!isEnvelope &&
            sortedAttachments.map((atta, idx) => {
              const hintType = (() => {
                if (atta.isLastTimeChanged) {
                  return "changed";
                }
                if (atta.isLastTimeFailed) {
                  return "notChanged";
                }
                return null;
              })();

              return (
                <AttachmentWrapper key={idx}>
                  <File
                    onMouseEnter={() => setFileHover(atta.attachment_id)}
                    onMouseLeave={() => setFileHover(null)}
                    isHighLight={
                      isReviewing &&
                      (atta.isLastTimeFailed || atta.isLastTimeChanged)
                    }
                  >
                    {fileName(atta)}
                    {isReviewing &&
                      hintType &&
                      fileHover === atta.attachment_id && (
                        <ReviewTooltip type={hintType} />
                      )}
                  </File>
                  <ButtonWithLoading
                    isLoading={isLoading && loadingId === atta.file_id}
                    type="primary"
                    handleEvent={() => onDownloadAttachment(atta)}
                  >
                    {t("btn_download", { ns: "create" })}
                  </ButtonWithLoading>
                </AttachmentWrapper>
              );
            })}
        </Content>
      </Body>
    </Wrapper>
  );
};

export default WindowWidth(AttachmentViewer);
