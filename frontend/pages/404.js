import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import ErrorContent from "../components/ErrorContent";
import { PageWrapper } from "../global/styled";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["meta", "common"])),
    },
  };
};

const error = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="error" />
    <ErrorContent />
  </PageWrapper>
);

export default error;
