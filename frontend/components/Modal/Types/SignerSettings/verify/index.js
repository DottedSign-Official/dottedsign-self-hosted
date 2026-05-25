import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { MODAL_TYPE } from "../../../../../constants/constants";
import { openModal as openModalAction } from "../../../../../redux/actions/common";
import { Block, Label, Item } from "../styled";
import { Link, Text } from "./styled";

const Verify = ({ warningSystemCA, onBackup, myObj }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const onModalVerifyOpen = () => {
    onBackup();

    openModal({
      modalType: MODAL_TYPE.authMethod,
      modalData: {
        uid: myObj.uid,
        email: myObj.email,
      },
    });
  };

  const textVerify = (() => {
    if (!myObj.verify || myObj.verify.length < 1) {
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
    if (!myObj.verify || myObj.verify.length < 1) {
      return null;
    }

    if (myObj.verify[0].occassion === "read") {
      return <Text>{t("verify_timing_read")}</Text>;
    }

    return <Text>{t("verify_timing_sign")}</Text>;
  })();

  return (
    <Block>
      <Label>{t("identity_verify_methods")}</Label>

      {textVerify}
      {textTiming}

      <Item>
        <Link onClick={onModalVerifyOpen}>{t("btn_edit")}</Link>
      </Item>
    </Block>
  );
};

export default Verify;
