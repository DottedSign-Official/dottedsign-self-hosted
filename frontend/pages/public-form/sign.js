import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

import { setIsPublicForm as setIsPublicFormAction } from "../../redux/actions/sign";

import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import ContentPublicFormSign from "../../containers/ContentPublicFormSign";
import { PageWrapper } from "../../global/styled";
import Hint from "../../components/Hint";

const PagePublicForm = ({ uuid }) => {
  const dispatch = useDispatch();
  const setIsPublicForm = (data) => dispatch(setIsPublicFormAction(data));

  useEffect(() => {
    setIsPublicForm(true);
    return () => {
      setIsPublicForm(false);
    };
  }, []);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="publicForm" />
      <Modal />
      <Toast />
      <Hint />
      <ContentPublicFormSign form_uuid={uuid} />
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ req, query, locale }) => {
  const lang = req?.cookies?.["next-i18next"] || locale;
  const { uuid } = query;

  return {
    props: {
      uuid,
      ...(await serverSideTranslations(lang, [
        "common",
        "meta",
        "modal",
        "toast",
        "create",
        "settings",
        "cover",
        "hint",
      ])),
    },
  };
};

export default PagePublicForm;
