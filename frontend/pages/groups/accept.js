import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../../components/head";
import AcceptStatus from "../../containers/AcceptStatus";

const pageAcceptance = () => (
  <>
    <Head page="accept" />
    <AcceptStatus />
  </>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "cover",
      "login",
    ])),
  },
});

export default pageAcceptance;
