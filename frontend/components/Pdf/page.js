import React from "react";
import { useInView } from "react-intersection-observer";
import LoaderPdf from "../Loaders/PdfPageContainer";
import {
  WrapperLoader,
  WrapperPage,
  ContainerWrapper,
  Container,
} from "./styled";
import ReactPdfPage from "./ReactPdfPage";

const Page = ({
  viewportContainer,
  idx,
  onPgLoadSuccess,
  onPageRenderSuccess,
  scale,
  cache,
  setCache,
}) => {
  const { ref, inView } = useInView();

  if (!viewportContainer[idx] || !viewportContainer[idx].height) {
    return null;
  }

  const onLoadSuccessFactory = (pageIndex) => (data) => {
    onPgLoadSuccess({ ...data, pageIndex });
  };

  const displayScale = scale[idx]?.display || 1;

  return (
    <WrapperPage
      ref={ref}
      height={viewportContainer[idx].height * displayScale}
      width={viewportContainer[idx].width * displayScale}
    >
      {inView ? (
        <ReactPdfPage
          image={cache[idx]}
          setImage={(url) => setCache((prev) => ({ ...prev, [idx]: url }))}
          scale={scale[idx]}
          pageNumber={idx + 1}
          width={viewportContainer[idx].width}
          height={viewportContainer[idx].height}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onLoadSuccess={onLoadSuccessFactory(idx)}
          onRenderSuccess={() => onPageRenderSuccess(idx + 1)}
        />
      ) : (
        <LoaderPdf />
      )}
      <ContainerWrapper>
        <Container
          className="page"
          id={`pageContainer${idx + 1}`}
          height={viewportContainer[idx].height}
          width={viewportContainer[idx].width}
          scale={displayScale}
        ></Container>
      </ContainerWrapper>
    </WrapperPage>
  );
};

const Pages = (props) => {
  const { totalPage } = props;
  return [...Array(totalPage).keys()].map((idx) => (
    <Page key={idx} {...props} idx={idx} />
  ));
};

const PageContent = (props) => {
  const { viewportContainer } = props;

  return viewportContainer && viewportContainer.length > 0 ? (
    <Pages {...props} />
  ) : (
    <WrapperLoader />
  );
};

export default PageContent;
