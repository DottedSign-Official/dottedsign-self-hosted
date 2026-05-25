import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

import { getTemplatesAll } from "../../redux/actions/template";
import { setIsTemplate } from "../../redux/actions/create";

import CoverDownloadApp from "../../containers/CoverDownloadApp";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import ContDocSettings from "../../containers/ContDocSettings";
import { PageWrapper } from "../../global/styled";

const DocumentSettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTemplatesAll());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsTemplate(true));
  }, [dispatch]);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="templateSettings" />
      <Modal />
      <Toast />

      <CoverDownloadApp>
        <ContDocSettings page="settings-template" isSigners />
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
