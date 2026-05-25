import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Login from "../loginComponents";
import { LOGIN_STATE } from "../constants/constants";
import dynamic from "next/dynamic";
const Gdpr = dynamic(import("../components/Gdpr"));

import { PageWrapper } from "../global/styled";

const ResetPwd = () => (
  <PageWrapper isLoginPage>
    <Head />
    <Toast />
    <Login type={LOGIN_STATE.RESET_PWD} />
    <Gdpr />
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
    ])),
  },
});

export default ResetPwd;
