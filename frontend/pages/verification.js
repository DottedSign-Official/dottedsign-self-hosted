import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "../components/head";
import VerifyStatus from "../containers/VerifyStatus";

const pageVerification = () => (
  <>
    <Head page="verify" />
    <VerifyStatus />
  </>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["meta", "common"])),
  },
});

export default pageVerification;
