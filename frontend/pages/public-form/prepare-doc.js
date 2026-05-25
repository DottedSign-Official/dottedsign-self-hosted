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

const PublicFormPrepare = ({ id }) => {
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
        <ContDocSettings
          page="settings-public-form-create"
          isSigners
          isTemplate
          isPublicForm
          formId={id}
        />
      </CoverDownloadApp>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale, query }) => ({
  props: {
    id: query.id || null,
    ...(await serverSideTranslations(locale, [
      "common",
      "meta",
      "modal",
      "toast",
      "create",
      "settings",
      "publicForm",
    ])),
  },
});

export default PublicFormPrepare;
