import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { setIsTemplate } from "../../redux/actions/create";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import CoverDownloadApp from "../../containers/CoverDownloadApp";
import ContDocSettings from "../../containers/ContDocSettings";

import { PageWrapper } from "../../global/styled";

const DocumentSettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsTemplate(false));
  }, [dispatch]);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="createSettings" />
      <Modal />
      <Toast />

      <CoverDownloadApp>
        <ContDocSettings page="settings-s-n-s" />
      </CoverDownloadApp>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "modal",
      "toast",
      "create",
    ])),
  },
});

export default DocumentSettings;
