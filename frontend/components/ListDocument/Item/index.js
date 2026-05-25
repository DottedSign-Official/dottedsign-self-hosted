import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import * as commonActions from "../../../redux/actions/common";
import * as createActions from "../../../redux/actions/create";
import {
  getDoc,
  formatFileSize,
  getDocTotalPagesAndFileSize,
} from "../../../helpers/others";
import Loader from "../../Loaders/ItemDocument";
import More from "../../../containers/More";
import toastType from "../../../constants/toast";
import { WrapperList } from "../../../global/styledCreate";
import {
  Wrapper,
  Text,
  Filename,
  Pages,
  ColMove,
  ColMore,
  DeleteCorner,
} from "./styled";
import Icon from "../../Icon";

const DocumentItem = ({
  file,
  focusFile,
  setFocusFile,
  onDelete,
  isEnvelope,
  isShowMore,
  isDraggable,
  listeners,
}) => {
  const { t } = useTranslation("create");

  const { tmpFiles } = useSelector((state) => state.create);

  const dispatch = useDispatch();
  const openToast = (data) => dispatch(commonActions.openToast(data));

  const refSubscribed = useRef();
  const [pageNumText, setPageNumText] = useState(null);
  const [fileSizeText, setFileSizeText] = useState(null);

  const isDeletable = isEnvelope;

  const fileInputRef = useRef(null);

  const onTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (event) => {
    const validateFiles = async (originalFile, newFile) => {
      const [originalMeta, newMeta] = await Promise.all([
        getDocTotalPagesAndFileSize(originalFile),
        getDocTotalPagesAndFileSize(newFile),
      ]);
      const isDimensionsMatch =
        originalMeta.width === newMeta.width &&
        originalMeta.height === newMeta.height;
      const isPageCountValid = newMeta.pageCount >= originalMeta.pageCount;
      return { isDimensionsMatch, isPageCountValid };
    };
    const file = tmpFiles[0];
    const newFile = event.target.files[0];
    const { isDimensionsMatch, isPageCountValid } = await validateFiles(
      file,
      newFile,
    );
    if (isDimensionsMatch && isPageCountValid) {
      dispatch(createActions.setTmpFiles([newFile]));
    } else {
      if (!isDimensionsMatch) {
        openToast({ payload: toastType.sizeMismatch });
      }
      if (!isPageCountValid) {
        openToast({ payload: toastType.lessThanTemplatePages });
      }
    }
  };

  const itemMoreMenu = {
    templateReplaceDocument: {
      isVisible: true,
      onClickEvent: onTriggerFileInput,
    },
  };

  useEffect(() => {
    refSubscribed.current = true;

    return () => {
      refSubscribed.current = false;
    };
  }, []);

  useEffect(() => {
    let fileUrl;

    const fetchData = async () => {
      fileUrl = URL.createObjectURL(file);

      let doc;
      if (refSubscribed.current) {
        doc = await getDoc(fileUrl);
      }

      if (doc) {
        if (refSubscribed.current) {
          const numText =
            doc._pdfInfo.numPages > 1
              ? `${doc._pdfInfo.numPages} ${t("page")}`
              : t("single_page");

          setPageNumText(numText);
        }

        doc.destroy();
      }

      setFileSizeText(formatFileSize(file.size));
    };

    if (file && file.type === "application/pdf") {
      fetchData();
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, t]);

  return (
    <WrapperList
      isFocus={isEnvelope ? false : file === focusFile}
      onClick={isEnvelope ? () => {} : () => setFocusFile(file)}
      isDraggable={isDraggable}
    >
      {pageNumText ? (
        <Wrapper>
          <Text>
            <Filename>{file.name}</Filename>
            <Pages>
              {pageNumText}, {fileSizeText}
            </Pages>
          </Text>

          {isDeletable && (
            <DeleteCorner onClick={() => onDelete(file)}>
              <Icon type="cancelBlack" />
            </DeleteCorner>
          )}

          {isShowMore && (
            <ColMore>
              <More menu={itemMoreMenu} />
            </ColMore>
          )}

          {isDraggable && (
            <ColMove {...(isDraggable ? listeners : {})}>
              <Icon type="drag" />
            </ColMove>
          )}
        </Wrapper>
      ) : (
        <Loader />
      )}
      <input
        accept="application/pdf"
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </WrapperList>
  );
};

export default DocumentItem;
