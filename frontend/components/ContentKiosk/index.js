import React from "react";
import NextHead from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Navbar from "../../containers/Navbar";
import Task from "./Task";
import SidePanel from "../SidePanel";
import PhotoSignatures from "../PhotoSignatures";
import { TopHolder, WrapperPdf, ToggleWrapper } from "./styled";
const Pdf = dynamic(() => import("../Pdf"), { ssr: false });

const ContentKiosk = ({ taskId, fileUrl, title, stages }) => {
  const { taskBlocks } = useSelector((state) => state.sign);

  const isShowPhotoSigningBtn = taskBlocks?.some(
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
        </ToggleWrapper>
      </WrapperPdf>

      {fileUrl && taskId && stages && <Task task_id={taskId} stages={stages} />}
    </>
  );
};

export default ContentKiosk;
