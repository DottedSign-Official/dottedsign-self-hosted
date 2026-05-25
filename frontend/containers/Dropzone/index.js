import React, { useRef, useEffect } from "react";
import uuid from "uuid/v1";
import { useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import toastType from "../../constants/toast";
import { uploadFormat } from "../../constants/constants";
import { compressImage } from "../../helpers/image";
import { getDoc } from "../../helpers/others";
import { cancellablePromise } from "../../helpers/customHooks";
import Dropzone from "../../components/Dropzone";
import useIOS from "./useIOS";

const DropzoneContainer = ({
  id,
  type,
  isHint,
  allowedFormat, // NOTE: [csv, image, pdf, all]
  customAllowedFormat,
  isMulti,
  isContinuousUpload,
  singleFileSizeLimit,
  allFileSizeLimit,
  setFiles,
  btnText,
  hintText,
}) => {
  const { isMultiWrapper, onDropEventWrapper } = useIOS(isMulti);

  const myPromises = useRef(null);
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));

  useEffect(() => {
    myPromises.current = [];

    return () => myPromises.current.map((p) => p.cancel());
  }, []);

  const fileSize = singleFileSizeLimit ? singleFileSizeLimit : 10000000;
  const allowedFormatObj = customAllowedFormat
    ? customAllowedFormat
    : uploadFormat[allowedFormat];
  const accept = allowedFormatObj.list.join(", ");

  const appendPromise = (prom) => {
    myPromises.current = [...myPromises.current, prom];
  };

  const removePromise = (prom) => {
    myPromises.current = myPromises.current.filter((p) => p !== prom);
  };

  // NOTE: Due to browser differences, some file `type` attributes may be empty; check the extension to determine file type.
  const checkSpecialFileTypes = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return (
      fileExtension === "rar" ||
      fileExtension === "7z" ||
      fileExtension === "zip"
    );
  };

  const onDropEvent = async (
    isContinuousUpload,
    previousFile,
    acceptedFiles,
  ) => {
    const processedFiles = isContinuousUpload
      ? [...previousFile, ...acceptedFiles]
      : acceptedFiles;

    let newFiles = [];
    let warnType;

    const promises = processedFiles.map(async (file, idx) => {
      const isImage = uploadFormat["image"].list.indexOf(file.type) > -1;
      let obj;

      if (
        allowedFormatObj.fileType.indexOf(file.type) === -1 &&
        !checkSpecialFileTypes(file)
      ) {
        return (warnType = allowedFormatObj.error);
      }

      if (file.size > fileSize) {
        return (warnType = toastType.fileOversize);
      }

      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        const wrappedProm = cancellablePromise(getDoc(fileUrl));
        appendPromise(wrappedProm);

        try {
          const { isCanceled, value } = await wrappedProm.promise;
          removePromise(wrappedProm);

          if (isCanceled) {
            return;
          }
          if (!value) {
            return (warnType = toastType.filePasswordProtected);
          }
        } catch (err) {
          removePromise(wrappedProm);
          return (warnType = toastType.commonError);
        }
      }

      if (isImage) {
        const wrappedProm = cancellablePromise(compressImage(file));
        appendPromise(wrappedProm);

        try {
          const { isCanceled, value } = await wrappedProm.promise;
          removePromise(wrappedProm);

          if (isCanceled) {
            return;
          }
          if (!value) {
            return (warnType = toastType.commonError);
          }

          if (value) {
            obj = value;
          }
        } catch (err) {
          removePromise(wrappedProm);
        }
      } else {
        obj = { file };
      }

      newFiles.push({
        fileId: `file_${uuid()}`,
        idx,
        ...obj,
      });
    });

    await Promise.all(promises);

    newFiles.sort((a, b) => a.idx - b.idx);

    (() => {
      let totalSize = 0;

      newFiles.forEach(({ file }) => {
        totalSize += file.size;
      });

      if (totalSize > allFileSizeLimit) {
        warnType = toastType.totalFileOversize;
      }
    })();

    if (warnType) {
      return openToast({ payload: warnType });
    }

    if (newFiles && newFiles.length > 0) {
      setFiles(newFiles);
    } else {
      openToast({ payload: toastType.commonError });
    }
  };

  return (
    <Dropzone
      id={id}
      type={type}
      isHint={isHint}
      accept={accept}
      isMulti={isMultiWrapper(isMulti)}
      isContinuousUpload={isContinuousUpload}
      btnText={btnText}
      hintText={hintText}
      onDropEvent={onDropEventWrapper(onDropEvent)}
    />
  );
};

export default DropzoneContainer;
