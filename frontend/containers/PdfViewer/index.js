import React, { useEffect } from "react";
import NextHead from "next/head";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { setIsMobile } from "../../redux/actions/pdf";
import { PDF_RENDER_TYPE } from "../../constants/constants";
import WindowWidth from "../WindowWidth";
import Navbar from "../Navbar";
import PdfThumbnail from "../PdfThumbnail";
import SwitchFile from "../SwitchFile";
import PdfTask from "../../components/PdfTask";
import Cover from "../../components/Cover";
import Hint from "../../components/Hint";
import SidePanel from "../../components/SidePanel";
import PhotoSignatures from "../../components/PhotoSignatures";

import { TopHolder, WrapperHint, WrapperPdf, ToggleWrapper } from "./styled";

const Pdf = dynamic(() => import("../../components/Pdf"), { ssr: false });

const PdfViewer = ({ isMobile, isGuestSign }) => {
  const {
    filename,
    envelopeName,
    fileUrl,
    hint,
    resultType,
    isEnvelope,
    taskBlocks,
    isOwner,
  } = useSelector((state) => state.sign);

  const isShowPhotoSigningBtn = isOwner
    ? taskBlocks?.some((task) =>
        task.blocks?.some((block) => block.options?.photo === true),
      )
    : taskBlocks?.some(
        (task) =>
          task.isMyTurn &&
          task.blocks?.some((block) => block.options?.photo === true),
      );

  const { coverType } = useSelector((state) => state.common);
  const { pdfDocument, isRenderDone } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsMobile({ isMobile }));
  }, [isMobile, dispatch]);

  const contentPdf = () => {
    if (coverType) {
      return <Cover type={coverType} isVisible />;
    }

    if (resultType === PDF_RENDER_TYPE.blocked) {
      return null;
    }

    return (
      <WrapperPdf>
        <Pdf isMobile={isMobile} fileUrl={fileUrl} />
        {isMobile === false && (
          <ToggleWrapper>
            {isEnvelope && (
              <SidePanel type="envelope">
                <SwitchFile envelopeName={envelopeName} isInSigningPhase />
              </SidePanel>
            )}

            {isShowPhotoSigningBtn && (
              <SidePanel type="photo">
                <PhotoSignatures />
              </SidePanel>
            )}

            <PdfThumbnail isInSigningPhase />
          </ToggleWrapper>
        )}
      </WrapperPdf>
    );
  };

  const contentTask = () => {
    if (!pdfDocument) {
      return null;
    }
    if (!isRenderDone) {
      return null;
    }
    return <PdfTask />;
  };

  return (
    <>
      {(filename || envelopeName) && (
        <NextHead>
          <title>{isEnvelope ? envelopeName : filename}</title>
        </NextHead>
      )}

      <TopHolder>
        {hint && (
          <WrapperHint>
            <Hint type={hint} />
          </WrapperHint>
        )}

        <Navbar isGuestSign={isGuestSign} />
      </TopHolder>

      {contentPdf()}

      {contentTask()}
    </>
  );
};

export default WindowWidth(PdfViewer);
