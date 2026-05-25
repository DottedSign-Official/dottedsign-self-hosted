import React, { useRef, useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { EMBEDDED_STATUS } from "../constants/constants";
import Head from "../components/head";
import Modal from "../containers/Modal";
import Toast from "../containers/Toast";
import ContentFrontDesk from "../containers/ContentFrontDesk";
import Cover from "../components/Cover";
import { PageWrapper } from "../global/styled";
import { checkLicense } from "../containers/License";
import { LICENSE_TYPE } from "../constants/licenseTypes";

const PageFrontDesk = () => {
  const refTimerSign = useRef();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    refTimerSign.current = setTimeout(() => {
      setIsTimeout(true);
    }, 3600000);

    return () => {
      if (refTimerSign.current) {
        clearTimeout(refTimerSign.current);
      }
    };
  }, []);

  if (isTimeout) {
    return (
      <PageWrapper backcolor="#EEEFF3">
        <Cover type={EMBEDDED_STATUS.timeout} isVisible />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="frontDesk" />
      <Modal />
      <Toast />
      <ContentFrontDesk />
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "cover",
      "meta",
      "modal",
      "toast",
      "create",
      "settings",
    ])),
  },
});

export default checkLicense(PageFrontDesk, LICENSE_TYPE.KIOSK_TASK);
