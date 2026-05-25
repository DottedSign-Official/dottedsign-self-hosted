import React, { useState, useRef, useEffect } from "react";
import GridCanvas from "./GridCanvas";
import { BackgroundCanvas } from "./styled";
import { layoutGenerator } from "./data";

const TextStampCanvas = (
  {
    text,
    layout,
    fontSize,
    fontFamily,
    fontColor,
    gap,
    padding,
    border,
    borderColor,
    isChinese,
    onRender,
  },
  gridCanvasRef,
) => {
  const canvasRef = useRef(null);
  const [characterImages, setCharacterImages] = useState([]);
  const [gridSize, setGridSize] = useState(40);

  useEffect(() => {
    const images = [];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const padding = gap;
    const setFont = (ctx) => (ctx.font = `${fontSize}px ${fontFamily}`);

    const widths = [];
    const heights = [];
    const metrics = [];
    for (let i = 0; i < text.length; i++) {
      const character = text[i];

      setFont(ctx);
      const metric = ctx.measureText(character);
      const textWidth = metric.width;
      const textHeight =
        metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent;

      const paddedWidth = textWidth + 2 * padding;
      const paddedHeight = textHeight + 2 * padding;
      widths.push(paddedWidth);
      heights.push(paddedHeight);
      metrics.push(metric);
    }

    const maxWidth = Math.max(...widths);
    const maxHeight = Math.max(...heights);
    const size = Math.max(maxWidth, maxHeight);
    canvas.width = size;
    canvas.height = size;
    setGridSize(size);

    for (let i = 0; i < text.length; i++) {
      const character = text[i];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setFont(ctx);
      ctx.fillStyle = fontColor;

      const textX = (size - metrics[i].width) / 2;
      const baseY = size - metrics[i].actualBoundingBoxDescent;
      const alignVerticalOffset = -size / 2 + heights[i] / 2;
      const textY = baseY + (isChinese ? alignVerticalOffset : 0);
      ctx.fillText(character, textX, textY);

      const imageSrc = canvas.toDataURL("image/png");
      images.push(imageSrc);
    }
    setCharacterImages(images);
  }, [text, fontSize, fontFamily, fontColor, gap, isChinese]);

  return (
    <>
      <BackgroundCanvas ref={canvasRef} />
      {characterImages.length > 0 && (
        <GridCanvas
          ref={gridCanvasRef}
          grid={layoutGenerator[layout](text)}
          images={characterImages}
          gridSize={gridSize}
          padding={padding}
          border={border}
          borderColor={borderColor}
          onRender={onRender}
        />
      )}
    </>
  );
};

export default React.forwardRef(TextStampCanvas);
