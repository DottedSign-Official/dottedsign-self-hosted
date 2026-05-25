import React from "react";
import Btn from "../../../../Button";
import UserStage from "../../../../UserStage";
import UserStatus from "../../../../UserStatus";
import { Record, Blk } from "../styled";
import { BtnWrapper } from "./styled";

const SignerStatus = ({ t, stages, isLoading, onResend }) => {
  return (
    <>
      <Record isTitle>
        <Blk width="65%" color="gray">
          {t("signer")}
        </Blk>
        <Blk width="30%" color="gray">
          {t("status")}
        </Blk>
      </Record>

      {stages &&
        stages.map((stage, idx) => (
          <Record key={idx}>
            <Blk width="65%">
              <UserStage stage={stage} />
            </Blk>
            <Blk width="15%">
              <UserStatus text={stage.statusText} color={stage.statusColor} />
            </Blk>
            {stage.isResend && (
              <Blk width="20%">
                <BtnWrapper>
                  <Btn
                    type={isLoading ? "disabled" : "primaryFlex"}
                    handleEvent={isLoading ? null : () => onResend(stage)}
                  >
                    {t("btn_resend_short")}
                  </Btn>
                </BtnWrapper>
              </Blk>
            )}
          </Record>
        ))}
    </>
  );
};

export default SignerStatus;
