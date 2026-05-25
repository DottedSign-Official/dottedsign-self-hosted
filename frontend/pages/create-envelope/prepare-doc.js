import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { setIsTemplate } from "../../redux/actions/create";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import CoverDownloadApp from "../../containers/CoverDownloadApp";
import EnvelopeDocSettings from "../../components/EnvelopeDocSettings";
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
        <EnvelopeDocSettings page="settings-create-envelope-task" isSigners />
      </CoverDownloadApp>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "meta",
      "modal",
      "toast",
      "create",
      "settings",
    ])),
  },
});

export default DocumentSettings;
