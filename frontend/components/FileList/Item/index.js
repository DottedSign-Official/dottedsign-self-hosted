import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setFileUrl as setFileUrlCreateAction,
  setFileFocus as setFileFocusCreateAction,
} from "../../../redux/actions/create";
import {
  setPageInvolvers as setPageInvolversAction,
  setFileFocus as setFileFocusSignAction,
  setFileUrl as setFileUrlSignAction,
} from "../../../redux/actions/sign";

import { filterPageInvolversByFileId } from "../../../helpers/task";

import Loader from "../../Loaders/ItemDocument";
import TagNumber from "../../TagNumber";
import Icon from "../../Icon";

import { WrapperTag, GuideText } from "../../Navbar/styled";
import { WrapperList } from "../../../global/styledCreate";
import { Wrapper, Text, Filename, Pages, ColMove } from "./styled";

const DocumentItem = ({
  fileInfo,
  fileFocus,
  isInSigningPhase,
  isInAssignFieldsPhase,
  isDraggable,
  listeners,
}) => {
  const { t } = useTranslation("create");
  const fileUrlRef = useRef(null);
  const dispatch = useDispatch();
  const setFileUrl = (url) =>
    dispatch(
      isInSigningPhase
        ? setFileUrlSignAction(url)
        : setFileUrlCreateAction(url),
    );

  const setFileFocus = (fileFocus) =>
    dispatch(
      isInSigningPhase
        ? setFileFocusSignAction(fileFocus)
        : setFileFocusCreateAction(fileFocus),
    );
  const setPageInvolvers = (pi) => dispatch(setPageInvolversAction(pi));

  const {
    appliedSigns,
    allFilesInvolvers,
    isMyTurn,
    taskBlocks: rawTaskBlocks,
  } = useSelector((state) => state.sign);

  const taskBlocksInMyTurn = useMemo(
    () => (isInSigningPhase ? rawTaskBlocks.filter((blk) => blk.isMyTurn) : []),
    [rawTaskBlocks, isInSigningPhase],
  );

  const [blkRequired, setBlkRequired] = useState([]);

  const colorId = isMyTurn ? 0 : null;

  const handleClick = () => {
    if (fileInfo === fileFocus) {
      return;
    }

    const newFileUrl =
      fileInfo.fileUrl ||
      (fileInfo.file ? URL.createObjectURL(fileInfo.file) : null);

    if (fileUrlRef.current && fileInfo.file) {
      URL.revokeObjectURL(fileUrlRef.current);
    }

    if (fileInfo.file) {
      fileUrlRef.current = newFileUrl;
    }

    if (newFileUrl) {
      setFileUrl({ url: newFileUrl });
    }
    setFileFocus(fileInfo);

    setPageInvolvers(
      filterPageInvolversByFileId(allFilesInvolvers, fileInfo.fileId),
    );
  };

  useEffect(() => {
    if (!isInSigningPhase) {
      return;
    }
    const taskBlocks = taskBlocksInMyTurn;
    let blkRequiredTemp = [];
    taskBlocks.map((task) => {
      if (task.status === "processing") {
        let orderCounter = 0;
        task.blocks.map((blk) => {
          if (blk.options.force && blk.taskId === fileInfo?.fileId) {
            blkRequiredTemp.push({
              order: orderCounter,
              ...blk,
              stageId: task.stageId,
            });
            orderCounter++;
          }
        });
      }
    });

    setBlkRequired(blkRequiredTemp);
  }, [isInSigningPhase, taskBlocksInMyTurn, fileInfo]);

  return (
    <WrapperList
      isDraggable={false}
      isFocus={fileInfo === fileFocus}
      onClick={handleClick}
    >
      {fileInfo.pageNum ? (
        <Wrapper>
          <Text>
            <Filename>{fileInfo.fileName}</Filename>
            <Pages>
              {fileInfo.pageNum > 1
                ? `${fileInfo.pageNum} ${t("page")}`
                : t("single_page")}
              , {fileInfo.fileSizeText}
            </Pages>
          </Text>

          {isInSigningPhase && isMyTurn && (
            <>
              <WrapperTag>
                <TagNumber indx={colorId} />
              </WrapperTag>

              <GuideText>
                {`${
                  appliedSigns.filter(
                    (sig) =>
                      sig.options.force && sig.taskId === fileInfo.fileId,
                  ).length
                }/${blkRequired.length}`}
              </GuideText>
            </>
          )}

          {isInAssignFieldsPhase && isDraggable && (
            <ColMove {...(isDraggable ? listeners : {})}>
              <Icon type="drag" />
            </ColMove>
          )}
        </Wrapper>
      ) : (
        <Loader />
      )}
    </WrapperList>
  );
};

export default DocumentItem;
