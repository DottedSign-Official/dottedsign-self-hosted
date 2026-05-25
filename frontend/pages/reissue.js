import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import ReissueTask from "../containers/ReissueTask";
import { PageWrapper } from "../global/styled";

const PageReissue = ({ code }) => {
  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="tasks" />
      <Toast />
      <ReissueTask code={code} />
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale, query }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "toast",
      "cover",
      "hint",
      "tasks",
    ])),
    code: query?.code || null,
  },
});

export default PageReissue;
