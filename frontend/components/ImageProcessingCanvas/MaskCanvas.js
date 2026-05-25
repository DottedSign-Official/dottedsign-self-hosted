import React, { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./styled";

const eraseCircle = (() => {
  let lastPoint = null;

  const drawCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLine = (ctx, x, y, lineWidth) => {
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    const radius = lineWidth / 2;
    drawCircle(ctx, lastPoint.x, lastPoint.y, radius);
    drawCircle(ctx, x, y, radius);
  };

  return (ctx, x, y, isErasing, radius, isInitialPoint) => {
    if (isInitialPoint) {
      lastPoint = null;
    }

    ctx.globalCompositeOperation = isErasing
      ? "destination-out"
      : "source-over";

    if (!lastPoint) {
      drawCircle(ctx, x, y, radius);
    } else {
      drawLine(ctx, x, y, radius * 2);
    }

    lastPoint = {
      x,
      y,
    };

    ctx.globalCompositeOperation = "source-over";
  };
})();

const applyMask = (mask, canvas, result) => {
  const ctx = result.getContext("2d");

  ctx.clearRect(0, 0, result.width, result.height);

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(mask, 0, 0);

  ctx.globalCompositeOperation = "source-in";

  ctx.drawImage(canvas, 0, 0);

  ctx.globalCompositeOperation = "source-over";
};

const MaskCanvas = ({ width, height }, ref) => {
  const maskRef = useRef(null);

  useEffect(() => {
    maskRef.current.width = width;
    maskRef.current.height = height;
    const ctx = maskRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ref.current = {
      restoreMask: (mouseX, mouseY, radius, isInitialPoint) => {
        eraseCircle(
          maskRef.current.getContext("2d"),
          mouseX,
          mouseY,
          false,
          radius,
          isInitialPoint,
        );
      },
      drawMask: (mouseX, mouseY, radius, isInitialPoint) => {
        eraseCircle(
          maskRef.current.getContext("2d"),
          mouseX,
          mouseY,
          true,
          radius,
          isInitialPoint,
        );
      },
      applyMask: (canvas, result) => {
        applyMask(maskRef.current, canvas, result);
        return result;
      },
    };
  }, [width, height, ref]);

  return <BackgroundCanvas ref={maskRef} />;
};

export default React.forwardRef(MaskCanvas);
