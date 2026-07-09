import { useTranslation } from "next-i18next";
import {
  ContentBlock,
  WrapperItem,
  ItemLabel,
  ItemDesc,
} from "../../global/styledSettings";

const SettingLicense = ({ isLoading, expiryInfo }) => {
  const { t } = useTranslation("settings");

  if (isLoading || !expiryInfo) {
    return null;
  }

  return (
    <ContentBlock>
      <WrapperItem>
        <ItemLabel>{t("settings_license_period")}</ItemLabel>
        <ItemDesc>{`${expiryInfo.starts_at} - ${expiryInfo.expires_at}`}</ItemDesc>
      </WrapperItem>
    </ContentBlock>
  );
};

export default SettingLicense;
