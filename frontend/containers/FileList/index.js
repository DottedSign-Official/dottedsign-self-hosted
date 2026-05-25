import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import {
  setFileName as setFileNameAction,
  setFileList as setFileListAction,
} from "../../redux/actions/create";
import toastType from "../../constants/toast";
import FileList from "../../components/FileList";

const FileListContainer = ({ isInSigningPhase, isInAssignFieldsPhase }) => {
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));
  const setFileName = (name) => dispatch(setFileNameAction(name));
  const setFileList = (fileList) => dispatch(setFileListAction(fileList));
  const { fileList, fileFocus } = useSelector((state) =>
    isInSigningPhase ? state.sign : state.create,
  );

  const onPasswordProtected = () => {
    openToast({ payload: toastType.filePasswordProtected });
  };

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
      let newItems = arrayMove(fileList, oldIndex, newIndex);
      setFileList(newItems);
    }
  };

  if (!fileList || (fileList && fileList.length < 1)) {
    return null;
  }
  return (
    <FileList
      fileList={fileList}
      fileFocus={fileFocus}
      setFileName={setFileName}
      onPasswordProtected={onPasswordProtected}
      onMove={onMove}
      isInSigningPhase={isInSigningPhase}
      isInAssignFieldsPhase={isInAssignFieldsPhase}
    />
  );
};

export default FileListContainer;
