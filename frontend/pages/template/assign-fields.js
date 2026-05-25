import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/actions/common";
import { getTemplate, resetCreate } from "../../redux/actions/create";
import { getTemplatesAll } from "../../redux/actions/template";
import { MODAL_TYPE } from "../../constants/constants";

import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Toast from "../../containers/Toast";
import CoverDownloadApp from "../../containers/CoverDownloadApp";
import Menu from "../../containers/MenuCreate";
import Assignes from "../../containers/EditAssignes";
import UploadDocuments from "../../containers/EditUploadDocument";
import Signs from "../../containers/EditSign";
import Attachments from "../../containers/EditAttachments";
import Labels from "../../containers/EditLabels";
import Pdf from "../../components/Pdf";
import PdfThumbnail from "../../containers/PdfThumbnail";

import { PageWrapper } from "../../global/styled";
import {
  WrapperFull,
  WrapperLeft,
  WrapperRight,
  ToggleWrapper,
} from "../../global/styledCreate";

const DocumentDetails = ({ queryObj }) => {
  const Router = useRouter();

  const templateId = queryObj.template_id;
  const { templatesCount, templatesShareCount } = useSelector(
    (state) => state.template,
  );
  const { fileUrl, shareInfo, assignes } = useSelector((state) => state.create);
  const { isRenderDone } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTemplatesAll());

    return () => dispatch(resetCreate());
  }, [dispatch]);

  useEffect(() => {
    if (!templateId && (!assignes || assignes.length < 1)) {
      Router.push("/tasks");
    }
  }, [templateId, assignes, Router]);

  useEffect(() => {
    if (templatesCount !== null && templatesShareCount !== null && templateId) {
      dispatch(getTemplate({ templateId, isTemplateEdit: true }));
    }
  }, [templatesCount, templatesShareCount, dispatch, templateId]);

  useEffect(() => {
    const isGuide = localStorage.getItem("hide_hotkeys_guide");

    if (
      (!isGuide || typeof isGuide === "undefined") &&
      shareInfo &&
      !shareInfo.share_by_others
    ) {
      dispatch(openModal({ modalType: MODAL_TYPE.notifyHotkeys }));
    }
  }, [shareInfo, dispatch]);

  const isViewOnly = shareInfo && shareInfo.share_by_others;

  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="templateDetails" />
      <Modal />
      <Toast />

      <CoverDownloadApp>
        <Menu page="details-template" isViewOnly={isViewOnly} />
        <WrapperFull>
          <WrapperLeft isDisabled={!isRenderDone}>
            <UploadDocuments isViewOnly={isViewOnly} />
            <Assignes isViewOnly={isViewOnly} />
            <Signs isViewOnly={isViewOnly} />
            <Attachments isViewOnly={isViewOnly} />
            {!isViewOnly && <Labels />}
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

export const getServerSideProps = async ({ query, locale }) => ({
  props: {
    queryObj: query,
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "modal",
      "toast",
      "create",
    ])),
  },
});

export default DocumentDetails;
