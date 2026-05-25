import React from "react";
import NextHead from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Navbar from "../../containers/Navbar";
import Task from "./Task";
import SidePanel from "../SidePanel";
import PhotoSignatures from "../PhotoSignatures";
import PdfThumbnail from "../../containers/PdfThumbnail";
import { TopHolder, WrapperPdf, ToggleWrapper } from "./styled";
const Pdf = dynamic(() => import("../Pdf"), { ssr: false });

const ContentPublicForm = ({ title, fileUrl }) => {
  const { taskBlocks, isOwner } = useSelector((state) => state.sign);

  const isShowPhotoSigningBtn = isOwner
    ? taskBlocks?.some((task) =>
        task.blocks?.some((block) => block.options?.photo === true),
      )
    : taskBlocks?.some(
        (task) =>
          task.isMyTurn &&
          task.blocks?.some((block) => block.options?.photo === true),
      );

  return (
    <>
      <NextHead>
        <title>{title}</title>
      </NextHead>

      <TopHolder>
        <Navbar isActionOnly />
      </TopHolder>

      <WrapperPdf>
        <Pdf fileUrl={fileUrl} />
        <ToggleWrapper>
          {isShowPhotoSigningBtn && (
            <SidePanel type="photo">
              <PhotoSignatures />
            </SidePanel>
          )}
          <PdfThumbnail isInSigningPhase />
        </ToggleWrapper>
      </WrapperPdf>

      <Task />
    </>
  );
};

export default ContentPublicForm;
