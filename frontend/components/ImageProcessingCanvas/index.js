import React, { useEffect, useState, useRef, useCallback } from "react";
import { loadImage } from "../../helpers/imageProcessing";
import MaskCanvas from "./MaskCanvas";
import BackgroundRemovalCanvas from "./BackgroundRemovalCanvas";
import InteractiveCanvas from "./InteractiveCanvas";

const useImageLoader = (src) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadImage(src).then(setImage);
  }, [src]);

  return image;
};

const ImageProcessingCanvas = (
  { imageURL, colors, threshold, eraserRadius, isErasing },
  ref,
) => {
  const image = useImageLoader(imageURL);

  const backgroundRemoveCanvas = useRef(null);
  const maskFuncs = useRef(null);

  useEffect(() => {
    if (!image) {
      return;
    }
    ref.current.width = image.width;
    ref.current.height = image.height;
  }, [image, ref]);

  const onMouseEvents = ({ mouseX, mouseY, isDragging, isMouseDown }) => {
    if (isDragging && eraserRadius) {
      const draw = isErasing
        ? maskFuncs.current.drawMask
        : maskFuncs.current.restoreMask;

      draw(mouseX, mouseY, eraserRadius, isMouseDown);
      maskFuncs.current.applyMask(backgroundRemoveCanvas.current, ref.current);
    }
  };

  const onBackgroundRemoved = useCallback(
    (canvas) => {
      if (maskFuncs.current) {
        maskFuncs.current.applyMask(canvas, ref.current);
      }
    },
    [maskFuncs, ref],
  );

  if (!image) {
    return null;
  }

  return (
    <>
      <BackgroundRemovalCanvas
        image={image}
        colors={colors}
        threshold={threshold}
        onRender={onBackgroundRemoved}
        ref={backgroundRemoveCanvas}
      />
      <MaskCanvas width={image.width} height={image.height} ref={maskFuncs} />
      <InteractiveCanvas
        ref={ref}
        onMouseEvents={onMouseEvents}
        cursor={{ size: eraserRadius, isDashed: isErasing }}
      />
    </>
  );
};

export default React.forwardRef(ImageProcessingCanvas);
