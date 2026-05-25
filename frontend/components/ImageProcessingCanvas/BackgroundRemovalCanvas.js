import React, { useEffect, useRef } from "react";
import { removeImageColor } from "../../helpers/imageProcessing";
import { BackgroundCanvas } from "./styled";

import { useWebGLPanel } from "../../helpers/webgl/hooks";

const BackgroundRemovalCanvas = (
  { image, colors, threshold, onRender },
  ref,
) => {
  const canvasRef = useRef(null);
  const panel = useWebGLPanel(image);

  useEffect(() => {
    if (!panel.isSupported) {
      return;
    }
    ref.current = panel.canvasRef.current;
    panel.removeColors({ colors, threshold });
    onRender(panel.canvasRef.current);
  }, [panel, colors, threshold, onRender, ref]);

  useEffect(() => {
    if (panel.isSupported) {
      return;
    }
    ref.current = canvasRef.current;
    removeImageColor({
      image,
      backgroundColors: colors,
      threshold,
      canvas: canvasRef.current,
    });
    onRender(canvasRef.current);
  }, [panel, image, colors, threshold, canvasRef, onRender, ref]);

  return (
    <>
      <BackgroundCanvas ref={panel.canvasRef} />
      <BackgroundCanvas ref={canvasRef} />
    </>
  );
};

export default React.memo(React.forwardRef(BackgroundRemovalCanvas));
