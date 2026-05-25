import { useState, useRef } from "react";
import { Page as ReactPage } from "react-pdf";
import { PageWrapper, Image } from "./styled";
import { useCallback } from "react";
import { useEffect } from "react";

const CachePage = ({ src, width, height }) => {
  return <Image src={src} alt="" width={width} height={height} />;
};

const useClampScale = (scale, canvas, maxSize) => {
  const [clampedScale, setClampedScale] = useState(1);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    if (!size) {
      const { width, height } = canvas;
      setSize({
        width,
        height,
      });
    }
    const maxScale =
      (size
        ? Math.min(maxSize / size.width, maxSize / size.height)
        : Math.min(maxSize / canvas.width, maxSize / canvas.height)) - 1e-1;

    const clampScale = Math.min(Math.max(1, scale), maxScale);
    setClampedScale(clampScale);
  }, [scale, size, maxSize, canvas]);

  return clampedScale;
};

const MAX_CANVAS_SIZE = 4096;
const ReactPdfPage = ({
  scale,
  onRenderSuccess,
  image,
  setImage,
  ...props
}) => {
  const displayScale = scale?.display || 1;
  const refreshScale = scale?.refresh || 1;
  const [renderScale, setRenderScale] = useState(null);
  const pdfCanvasRef = useRef(null);
  const clampScale = useClampScale(
    refreshScale,
    pdfCanvasRef.current,
    MAX_CANVAS_SIZE,
  );

  const handleRenderSuccess = useCallback(() => {
    pdfCanvasRef.current.toBlob((blob) => {
      if (image) {
        URL.revokeObjectURL(image);
      }
      setImage(URL.createObjectURL(blob));
    }, "image/png");
    setRenderScale(clampScale);
    onRenderSuccess();
  }, [onRenderSuccess, image, setImage, clampScale]);

  const isZooming = displayScale !== renderScale;
  return (
    <PageWrapper>
      <ReactPage
        scale={clampScale}
        {...props}
        canvasRef={pdfCanvasRef}
        onRenderSuccess={handleRenderSuccess}
      />
      <CachePage
        src={image}
        width={isZooming ? "100%" : pdfCanvasRef?.current?.style?.width}
        height={isZooming ? "100%" : pdfCanvasRef?.current?.style?.height}
      />
    </PageWrapper>
  );
};

export default ReactPdfPage;
