import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";

import AuthMethod from "../../../../AuthMethod";

import AuthTiming from "../../../../../components/AuthTiming";
import Tooltip from "../../../../../containers/Tooltip";
import tooltipType from "../../../../../constants/tooltip";

import {
  Wrapper,
  Text,
  TextWrp,
  Section,
  Label,
  WrapperBtn,
  Btn,
} from "./styled";

const Verify = ({
  setAssignee,
  myObj,
  isInfoUpdate,
  warningSystemCA,
  isCollapse,
  onCollapseToggle,
}) => {
  const { t } = useTranslation("modal");

  const needVerify = (() => {
    return myObj?.verify?.length > 0;
  })();

  const onUpdateMethods = (verifyMethod) => {
    setAssignee({
      ...myObj,
      verify: verifyMethod.map((verify) => ({
        occassion: myObj.verify?.[0]?.occassion,
        ...verify,
      })),
    });
  };

  const onTimingSelect = (occassion) => {
    setAssignee({
      ...myObj,
      verify: myObj.verify.map((verify) => ({
        ...verify,
        occassion,
      })),
    });
  };

  useEffect(() => {
    if (isInfoUpdate) {
      return;
    }
    if (!needVerify) {
      return;
    }

    const verifyType = myObj.verify[0]?.verify_type;
    const isCht = (() => {
      if (verifyType === "cht_personal") {
        return true;
      }
      if (verifyType === "cht_company") {
        return true;
      }
      if (verifyType === "cht_system") {
        return true;
      }
      return false;
    })();

    const valSkipConfirm = myObj?.stage_setting?.reviewed_skip_confirm;

    if (isCht && valSkipConfirm) {
      setAssignee({
        ...myObj,
        stage_setting: {
          ...myObj.stage_setting,
          reviewed_skip_confirm: false,
        },
      });
    }
  }, [myObj]);

  const textVerify = (() => {
    if (!needVerify) {
      return <Text>{t("no_need")}</Text>;
    }

    switch (myObj.verify[0].verify_type) {
      case "email":
        return <Text>{t("otp_email")}</Text>;
      case "cht_personal":
        return <Text>{t("cht_personal")}</Text>;
      case "cht_company":
        return <Text>{t("cht_company")}</Text>;
      case "cht_system":
        return (
          <>
            <Text warning={warningSystemCA}>
              {t("cht_system")}
              {warningSystemCA && (
                <>{` (${t("not_authorized_to_use_system_ca")})`}</>
              )}
            </Text>
            {!warningSystemCA && (
              <Text>{myObj.verify[0].verify_source?.name}</Text>
            )}
          </>
        );
      case "sms":
        return <Text>{t("otp_sms")}</Text>;
      case "emailAndSms":
        return <Text>{t("otp_both")}</Text>;
      default:
        return <Text>{t("no_need")}</Text>;
    }
  })();

  const textTiming = (() => {
    if (!needVerify) {
      return null;
    }

    if (myObj.verify[0].occassion === "read") {
      return <Text>{t("verify_timing_read")}</Text>;
    }

    return <Text>{t("verify_timing_sign")}</Text>;
  })();

  if (!myObj) {
    return null;
  }

  const showEditBtn =
    !isInfoUpdate &&
    (myObj.signer_type !== "form_signer" ||
      (myObj.signer_type === "form_signer" &&
        myObj.requisite?.email === "required"));

  return (
    <Wrapper>
      {isCollapse ? (
        <>
          <TextWrp showEditBtn={showEditBtn}>
            {textVerify}
            {textTiming}
          </TextWrp>
          <br />
          {showEditBtn && (
            <WrapperBtn>
              <Btn onClick={onCollapseToggle}>{t("btn_edit")}</Btn>
            </WrapperBtn>
          )}
        </>
      ) : (
        <>
          <Section>
            <Label>{t("identity_verify_methods")}</Label>
            <AuthMethod
              verifyMethod={myObj.verify || []}
              onUpdate={onUpdateMethods}
              target={myObj}
            />
          </Section>

          {needVerify && (
            <Section>
              <Label>
                {t("identity_verify_timing")}
                <span>
                  <Tooltip type={tooltipType.verifyTiming} position={"top"} />
                </span>
              </Label>
              <AuthTiming
                verifyMethod={myObj.verify}
                onUpdate={onTimingSelect}
              />
            </Section>
          )}

          <WrapperBtn>
            <Btn onClick={onCollapseToggle}>{t("btn_collapse")}</Btn>
          </WrapperBtn>
        </>
      )}
    </Wrapper>
  );
};

export default Verify;
