import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/actions/common";
import { fetchDraft } from "../../redux/actions/sign";
import { resetCreate, setInfo } from "../../redux/actions/create";
import { MODAL_TYPE } from "../../constants/constants";

import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";

import CoverDownloadApp from "../../containers/CoverDownloadApp";
import Menu from "../../containers/MenuCreate";
import Assignes from "../../containers/EditAssignes";
import Signs from "../../containers/EditSign";
import Attachments from "../../containers/EditAttachments";
import PdfThumbnail from "../../containers/PdfThumbnail";
import Pdf from "../../components/Pdf";

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
    return () => {
      dispatch(resetCreate());
      dispatch(
        setInfo({
          references: [],
          completedReferences: [],
          msgRequestReceivers: [],
          msgCompletedReceivers: [],
          message: null,
          completedMessage: null,
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    const taskId = Router.query.taskId;

    if (!taskId && (!assignes || assignes.length < 1)) {
      if (typeof window !== "undefined") {
        Router.push("/tasks");
      }
    }
  }, [assignes, Router]);

  useEffect(() => {
    const taskId = Router.query.taskId;

    if (taskId) {
      // NOTE: draft
      dispatch(fetchDraft({ sign_task_id: taskId }));
    }
  }, [dispatch, Router]);

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
  }, [isRenderDone, dispatch, isInit]);

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="createDetails" />
      <Modal />
      <Toast />

      <CoverDownloadApp>
        <Menu page="public-form-create" isDisabled={!isRenderDone} />
        <WrapperFull>
          <WrapperLeft isDisabled={!isRenderDone}>
            <Assignes />
            <Signs />
            <Attachments />
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
      "common",
      "meta",
      "modal",
      "toast",
      "create",
      "publicForm",
    ])),
  },
});

export default DocumentDetails;
