import React, { useRef, useEffect } from "react";
import { BackgroundCanvas } from "../styled";

const GridCanvas = (
  { grid, images, gridSize, border, padding, borderColor, onRender },
  forwardRef,
) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!grid || !grid.length || !grid[0]?.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onRender(canvas.toDataURL());
      return;
    }

    const rows = grid.length;
    const cols = grid[0].length;

    const width = cols * gridSize;
    const height = rows * gridSize;

    const totalBorder = (border + padding) * 2;
    canvas.width = width + totalBorder;
    canvas.height = height + totalBorder;

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const visited = [...Array(rows)].map(() => Array(cols).fill(false));

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    };

    const renderTextImages = (loadedImages) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!visited[row][col]) {
            const index = grid[row][col];
            let width = 1;
            let height = 1;

            while (col + width < cols && grid[row][col + width] === index) {
              width++;
            }
            while (row + height < rows && grid[row + height][col] === index) {
              height++;
            }

            for (let r = row; r < row + height; r++) {
              for (let c = col; c < col + width; c++) {
                visited[r][c] = true;
              }
            }

            const x = col * cellWidth + border + padding;
            const y = row * cellHeight + border + padding;
            const rectWidth = width * cellWidth;
            const rectHeight = height * cellHeight;

            const image = loadedImages[index];
            if (image) {
              ctx.drawImage(image, x, y, rectWidth, rectHeight);
            }
          }
        }
      }
    };

    const renderBorder = () => {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = border;

      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    let isCanceled = false;
    Promise.all(images.map(loadImage)).then((loadedImages) => {
      if (isCanceled) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderTextImages(loadedImages);
      renderBorder();
      onRender(canvas.toDataURL());
    });

    return () => {
      isCanceled = true;
    };
  }, [
    grid,
    images,
    gridSize,
    canvasRef,
    border,
    padding,
    borderColor,
    onRender,
  ]);

  return (
    <BackgroundCanvas
      ref={(ref) => {
        if (forwardRef) {
          forwardRef.current = ref;
        }
        canvasRef.current = ref;
      }}
    />
  );
};

export default React.forwardRef(GridCanvas);
