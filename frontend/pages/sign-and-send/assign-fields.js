import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/actions/common";
import { resetCreate } from "../../redux/actions/create";
import { MODAL_TYPE } from "../../constants/constants";

import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import CoverDownloadApp from "../../containers/CoverDownloadApp";
import Menu from "../../containers/MenuCreate";
import Signs from "../../containers/EditSignInsert";
import Pdf from "../../components/Pdf";
import PdfThumbnail from "../../containers/PdfThumbnail";
import { PageWrapper } from "../../global/styled";
import {
  WrapperFull,
  WrapperLeft,
  WrapperRight,
  ToggleWrapper,
} from "../../global/styledCreate";

const DocumentDetails = () => {
  const Router = useRouter();

  const [isInit, setIsInit] = useState(true);
  const { fileUrl, assignes } = useSelector((state) => state.create);
  const { isRenderDone } = useSelector((state) => state.pdf);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(resetCreate());
  }, [dispatch]);

  useEffect(() => {
    if (!assignes || assignes.length < 1) {
      Router.push("/tasks");
    }
  }, [Router, assignes]);

  useEffect(() => {
    const isGuide = localStorage.getItem("hide_hotkeys_guide");

    if (
      isInit &&
      isRenderDone &&
      (!isGuide || typeof isGuide === "undefined")
    ) {
      setIsInit(false);
      dispatch(openModal({ modalType: MODAL_TYPE.notifyHotkeys }));
    }
  }, [isRenderDone, dispatch, isInit, setIsInit]);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="createDetails" />
      <Modal />
      <Toast />

      <CoverDownloadApp>
        <Menu page="details-s-n-s" isDisabled={!isRenderDone} />
        <WrapperFull>
          <WrapperLeft isDisabled={!isRenderDone}>
            <Signs />
          </WrapperLeft>
          <WrapperRight>
            <Pdf fileUrl={fileUrl} />
            <ToggleWrapper>
              <PdfThumbnail />
            </ToggleWrapper>
          </WrapperRight>
        </WrapperFull>
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
      "settings",
      "validations",
    ])),
  },
});

export default DocumentDetails;
