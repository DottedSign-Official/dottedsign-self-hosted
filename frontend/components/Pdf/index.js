import React, { useRef, useEffect, useState } from "react";
import { Document } from "../../helpers/react-pdf";

import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import {
  setDocument as setDocumentAction,
  setViewport as setViewportAction,
  setTotalPage as setTotalPageAction,
  setCurrentPage as setCurrentPageAction,
  resetPdf,
  setIsRenderDone as setIsRenderDoneAction,
} from "../../redux/actions/pdf";
import toastStatus from "../../constants/toast";
import { usePinchZoom } from "../../helpers/customHooks";
import getAllViewport from "../../helpers/getViewport";
import { useEffectAsync } from "../../helpers/customHooks";
import DisableDefaultPinchZoom from "../DisableDefaultPinchZoom";
import LoaderPdf from "../Loaders/PdfPageContainer";
import PageContent from "./page";
import WindowWidth from "../../containers/WindowWidth";
import Error from "./Error";
import { Wrapper } from "./styled";

const options = {
  cMapUrl: "/static/cmaps/",
  cMapPacked: true,
};

const Pdf = ({ fileUrl, windowWidth }) => {
  if (!fileUrl) {
    return (
      <Wrapper>
        <LoaderPdf />
      </Wrapper>
    );
  }

  return <Cont fileUrl={fileUrl} windowWidth={windowWidth} />;
};

const Cont = ({ fileUrl, windowWidth }) => {
  const eleRef = useRef(null);
  const refThumbnails = useRef(null);
  const pinchScale = usePinchZoom(eleRef);
  const [cache, setCache] = useState({});
  const {
    pdfDocument,
    totalPage,
    thumbnails,
    viewportContainer,
    scaleArr,
    isRenderDone,
  } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));
  const setDocument = (data) => dispatch(setDocumentAction(data));
  const setViewport = (data) => dispatch(setViewportAction(data));
  const setTotalPage = (data) => dispatch(setTotalPageAction(data));
  const setIsRenderDone = (data) => dispatch(setIsRenderDoneAction(data));
  const setCurrentPage = (data) => dispatch(setCurrentPageAction(data));

  useEffectAsync(async () => {
    if (!pdfDocument) {
      return;
    }
    if (!windowWidth || windowWidth < 1) {
      return;
    }

    const vpData = await getAllViewport(pdfDocument);

    if (vpData?.viewportContainer && vpData?.scale) {
      const { viewportContainer, scale, scaleArr } = vpData;
      if (viewportContainer) {
        setViewport({ viewportContainer, scale, scaleArr });
      }
    }
  }, [windowWidth, pdfDocument]);

  useEffect(() => {
    return () => dispatch(resetPdf());
  }, [dispatch]);

  const onPassword = () => {
    openToast({ payload: toastStatus.filePasswordProtected });
  };

  const onDocumentLoadSuccess = (data) => {
    // NOTE: load font cdn first
    setTimeout(() => {
      setDocument(data);
      setTotalPage(data.numPages);
    }, 1000);
  };

  const onPgLoadSuccess = (data) => setCurrentPage(data.pageIndex + 1);

  const onLoadError = (err) => {
    console.log(err);
  };

  const onPageRenderSuccess = () => {
    if (isRenderDone) {
      return;
    }
    setIsRenderDone({ isRenderDone: true });
  };

  refThumbnails.current = thumbnails;

  const adjustedScales = scaleArr.map((scale) => ({
    display: pinchScale.display * scale,
    refresh: pinchScale.refresh * scale,
  }));

  return (
    <Wrapper id="viewer" tabIndex="10" ref={eleRef}>
      <DisableDefaultPinchZoom />
      <Document
        file={fileUrl}
        options={options}
        loading={<LoaderPdf />}
        error={<Error type="error" />}
        noData={<Error type="blank" />}
        onPassword={onPassword}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onLoadError}
      >
        <PageContent
          cache={cache}
          setCache={setCache}
          scale={adjustedScales}
          viewportContainer={viewportContainer}
          totalPage={totalPage}
          onPgLoadSuccess={onPgLoadSuccess}
          onPageRenderSuccess={onPageRenderSuccess}
        />
      </Document>
    </Wrapper>
  );
};

export default WindowWidth(Pdf);
