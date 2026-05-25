import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { getAuditTrail as getAuditTrailAction } from "../../../../redux/actions/sign";
import WindowWidth from "../../../../containers/WindowWidth";
import Btn from "../../../Button";
import { WrapperSub, WrapperItem } from "../../styled";

const StatusFinish = ({
  isMobile,
  data: { taskId, envelopeId, auditTrail },
}) => {
  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const getAuditTrail = (data) => dispatch(getAuditTrailAction(data));

  const onAuditTrailDownload = () => {
    if (taskId || envelopeId) {
      getAuditTrail({ taskId, envelopeId, isMobile });
    }
  };

  return (
    <WrapperSub>
      <WrapperItem>
        {auditTrail.isVisible && (
          <Btn
            handleEvent={auditTrail.disabled ? null : onAuditTrailDownload}
            type={auditTrail.disabled ? "disabled" : "primaryFlex"}
          >
            {t("audit_trail")}
          </Btn>
        )}
      </WrapperItem>
    </WrapperSub>
  );
};

export default WindowWidth(StatusFinish);
