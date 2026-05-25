import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Modal from "../containers/Modal";
import Header from "../components/Header";
import SearchContent from "../containers/SearchContent";
import { PageWrapper } from "../global/styled";

const Search = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="search" />
    <Toast />
    <Modal />

    <Header />
    <SearchContent />
  </PageWrapper>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "modal",
      "toast",
    ])),
  },
});

export default Search;
