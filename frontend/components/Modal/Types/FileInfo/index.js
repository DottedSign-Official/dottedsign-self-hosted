import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  getAuditTrailHistory as getAuditTrail,
  postInviteSignResend as postInviteSignResendAction,
} from "../../../../redux/actions/sign";
import Loader from "../../../Loaders/ModalFileStatus";
import Icon from "../../../Icon";
import FilePreview from "../../../FilePreview";
import Status from "./status";
import Audit from "./audit";
import { Wrapper, Close, Title } from "../../../../global/styledModal";
import {
  File,
  WrapperThumbnail,
  Text,
  FileName,
  Time,
  WrapperRecords,
  WrapperInner,
} from "./styled";

import PropTypes, {
  statusText,
  envelopeOrTaskId,
  envelopeOrFilename,
} from "../../../../helpers/propTypes";

const FileInfo = ({ onModalClose, data: { tabType, data } }) => {
  const { t } = useTranslation("modal");
  const { isLoading, auditTrail } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const postInviteSignResend = (data) =>
    dispatch(postInviteSignResendAction(data));

  const isEnvelope = data.envelopeId;
  const id = isEnvelope ? data.envelopeId : data.taskId;

  useEffect(() => {
    if (data && id) {
      dispatch(getAuditTrail(data));
    }
  }, [data, id, dispatch]);

  const onResend = (stage) => {
    postInviteSignResend({
      ...(data.envelopeId
        ? { envelope_id: data.envelopeId }
        : { sign_task_id: data.taskId }),
      email: stage.email,
    });
  };

  const getContent = () => {
    if (!data || !auditTrail || isLoading) {
      return <Loader />;
    }

    if (tabType === "signer_status") {
      return (
        <Status
          t={t}
          stages={data.stages}
          isLoading={isLoading}
          onResend={onResend}
        />
      );
    }

    if (tabType === "audit_trail") {
      return <Audit t={t} auditTrail={auditTrail.audit_trail} />;
    }

    return null;
  };

  const wrapperWidth = tabType === "audit_trail" ? 650 : 580;

  return (
    <Wrapper width={wrapperWidth + "px"}>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t(tabType)}</Title>
      <File>
        <WrapperThumbnail>
          <FilePreview thumbnail={data.thumbnail} />
        </WrapperThumbnail>
        <Text>
          <FileName>{isEnvelope ? data.envelopeName : data.filename}</FileName>
          <Time>
            <span>{t("modal_fileinfo_time_create")}</span>
            {data.createTime}
          </Time>
          <Time>
            <span>{t("modal_fileinfo_time_modify")}</span>
            {data.modifiedTime}
          </Time>
        </Text>
      </File>
      <WrapperRecords id="modal-body-scrollable">
        <WrapperInner>{getContent()}</WrapperInner>
      </WrapperRecords>
    </Wrapper>
  );
};

FileInfo.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tabType: PropTypes.string.isRequired,
    data: PropTypes.shape({
      taskId: envelopeOrTaskId,
      envelopeId: envelopeOrTaskId,
      filename: envelopeOrFilename,
      envelopeName: envelopeOrFilename,
      thumbnail: PropTypes.string.isRequired,
      createTime: PropTypes.string.isRequired,
      modifiedTime: PropTypes.string.isRequired,
      stages: PropTypes.arrayOf(
        PropTypes.shape({
          ...statusText,
          iconURL: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          isResend: PropTypes.bool.isRequired,
        }),
      ),
    }).isRequired,
  }).isRequired,
};

export default FileInfo;
