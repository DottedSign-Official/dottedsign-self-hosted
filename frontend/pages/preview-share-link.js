import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getPreviewShareSignTask } from "../redux/actions/sign";

import Head from "../components/head";
import Toast from "../containers/Toast";
import Modal from "../containers/Modal";
import PdfViewer from "../containers/PdfViewer";
import { PageWrapper } from "../global/styled";

const Content = React.memo(() => {
  if (typeof window === "undefined") {
    return null;
  }

  return <PdfViewer isGuestSign />;
});

Content.displayName = "memoPdfViewer";

const Pdf = () => {
  const router = useRouter();
  const { code, sign_task_id, envelope_id } = router.query;

  const dispatch = useDispatch();

  useEffect(() => {
    if (code || sign_task_id || envelope_id) {
      dispatch(getPreviewShareSignTask({ code, sign_task_id, envelope_id }));
    }
  }, [code, sign_task_id, envelope_id, dispatch]);

  return (
    <PageWrapper backcolor="#EEEFF3" isLock>
      <Head page="task" />
      <Toast />
      <Modal />
      <Content />
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "toast",
      "modal",
      "hint",
      "cover",
      "tasks",
      "settings",
      "create",
    ])),
  },
});

export default Pdf;
