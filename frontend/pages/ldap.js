import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import LDAPLogin from "../containers/LDAPLogin";
import { checkLicense } from "../containers/License";
import { LICENSE_TYPE } from "../constants/licenseTypes";
import GDPR from "../components/Gdpr";

import { PageWrapper } from "../global/styled";

const LDAPHome = () => (
  <PageWrapper isLoginPage>
    <Head />
    <Toast />
    <LDAPLogin />
    <GDPR />
  </PageWrapper>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "link",
      "common",
      "toast",
      "login",
      "validations",
    ])),
  },
});

export default checkLicense(LDAPHome, LICENSE_TYPE.LDAP);
