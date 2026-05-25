import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Login from "../loginComponents";
import GDPR from "../components/Gdpr";
import Version from "../containers/Version";

import { PageWrapper } from "../global/styled";

const Home = () => (
  <PageWrapper isLoginPage>
    <Head />
    <Toast />
    <Login />
    <GDPR />
    <Version />
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

export default Home;
