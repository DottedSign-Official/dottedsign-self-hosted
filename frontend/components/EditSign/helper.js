import { coordsAdjust, getFieldCoordOffset } from "../../helpers/coord2Styles";

export const getOffsetCoords = (coords, viewport) => {
  const fieldCoordOffset = getFieldCoordOffset(coords);
  return coordsAdjust(fieldCoordOffset, viewport);
};
