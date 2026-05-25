import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFileName as setFileNameAction,
  setFiles as setFilesAction,
} from "../../redux/actions/create";
import ListDocument from "../../components/ListDocument";

const ListDocumentContainer = ({ tmpFiles = [], isEnvelope, isShowMore }) => {
  const [focusFile, setFocusFile] = useState(null);
  const { files: reduxFiles, fileName } = useSelector((state) => state.create);
  const files = tmpFiles.length > 0 ? tmpFiles : reduxFiles;
  const dispatch = useDispatch();
  const setFileName = useCallback(
    (name) => dispatch(setFileNameAction(name)),
    [dispatch],
  );
  const setFiles = useCallback(
    (fls) => dispatch(setFilesAction(fls)),
    [dispatch],
  );

  const arrayMoveMutate = (array, from, to) => {
    const startIndex = from < 0 ? array.length + from : from;

    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;

      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
  };

  const arrayMove = (array, from, to) => {
    array = [...array];
    arrayMoveMutate(array, from, to);
    return array;
  };

  const onMove = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newItems = arrayMove(files, oldIndex, newIndex);
      setFiles(newItems);
    }
  };

  const onDelete = (item) => {
    const newItems = files.filter((itm) => itm !== item);
    setFiles(newItems);
  };

  useEffect(() => {
    if (fileName === "untitled" && files.length > 0 && tmpFiles.length === 0) {
      setFileName(files[0].name.replace(/.pdf/gi, ""));
    }
  }, [files]);

  if (!files || (files && files.length < 1)) {
    return null;
  }

  return (
    <ListDocument
      files={files}
      focusFile={focusFile}
      setFileName={setFileName}
      setFocusFile={setFocusFile}
      onDelete={onDelete}
      isEnvelope={isEnvelope}
      isShowMore={isShowMore}
      onMove={onMove}
    />
  );
};

export default ListDocumentContainer;
