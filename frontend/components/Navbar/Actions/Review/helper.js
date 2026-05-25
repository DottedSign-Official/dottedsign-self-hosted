import { CORNERS } from "./constants";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* NOTE:
type coord = [number, number, number, number];
type pdfWidth = number;
type pdfHeight = number;
*/
export const determineCorner = (coord, pdfWidth, pdfHeight) => {
  if (!Array.isArray(coord) || coord.length !== 4) {
    return null;
  }
  if (typeof pdfWidth !== "number" || pdfWidth <= 0) {
    return null;
  }
  if (typeof pdfHeight !== "number" || pdfHeight <= 0) {
    return null;
  }

  const [x1, y1, x2, y2] = coord;

  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  const isTop = centerY > pdfHeight / 2;
  const isBottom = !isTop;
  const isLeft = centerX < pdfWidth / 2;
  const isRight = !isLeft;

  if (isTop && isLeft) {
    return CORNERS.TOP_LEFT;
  }
  if (isTop && isRight) {
    return CORNERS.TOP_RIGHT;
  }
  if (isBottom && isLeft) {
    return CORNERS.BOTTOM_LEFT;
  }
  if (isBottom && isRight) {
    return CORNERS.BOTTOM_RIGHT;
  }
};

export const calculateHintPosition = (rev, viewport, isSelectionField) => {
  const distanceToRight = viewport[parseInt(rev.page)]?.width - rev.coord[2];
  const distanceToTop = viewport[parseInt(rev.page)]?.height - rev.coord[3];

  if (isSelectionField) {
    return distanceToRight < 100 ? "left" : "right";
  }

  const horizontal = distanceToRight < 68 ? "left" : "right";
  const vertical = distanceToTop < 40 ? "bottom" : "top";
  return `${vertical}-${horizontal}`;
};
