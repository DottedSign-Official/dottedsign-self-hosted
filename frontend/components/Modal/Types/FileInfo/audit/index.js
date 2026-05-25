import React from "react";
import { Record, Blk } from "../styled";
import { FlexVertical } from "./styled";

const AuditTrail = ({ t, auditTrail }) => (
  <>
    <Record isTitle>
      <Blk width="30%" color="gray">
        {t("server_time")}
      </Blk>
      <Blk width="45%" color="gray">
        {t("signer")}
      </Blk>
      <Blk width="25%" color="gray">
        {t("ip_device")}
      </Blk>
    </Record>
    {auditTrail &&
      auditTrail.map((stage, idx) => (
        <Record key={idx}>
          <Blk width="30%">
            <FlexVertical>
              <div>
                {stage.event_date} {stage.event_time}
              </div>
              <div>{stage.action_name}</div>
            </FlexVertical>
          </Blk>
          <Blk width="45%">{stage.role === "Me" ? "(Me)" : stage.role}</Blk>
          <Blk width="25%" color="gray">
            <FlexVertical>
              <div>{stage.ip_address}</div>
              <div>{stage.device}</div>
            </FlexVertical>
          </Blk>
        </Record>
      ))}
  </>
);

export default AuditTrail;
