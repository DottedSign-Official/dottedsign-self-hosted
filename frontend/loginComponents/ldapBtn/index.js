import { useRouter } from "next/router";

import Separator from "../separator";
import Button from "../../components/Button";

import { LicenseWrapper } from "../../containers/License";
import { LICENSE_TYPE } from "../../constants/licenseTypes";

const LDAPButton = ({ t }) => {
  const router = useRouter();

  return (
    <LicenseWrapper type={LICENSE_TYPE.LDAP}>
      <Separator text={t("or")} />
      <Button type="primary" handleEvent={() => router.push("/ldap")}>
        <p>{t("ldap_login")}</p>
      </Button>
    </LicenseWrapper>
  );
};

export default LDAPButton;
