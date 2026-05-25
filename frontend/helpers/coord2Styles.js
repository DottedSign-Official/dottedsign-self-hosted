// NOTE: Ensure the element's coordinates (oriCoords) stay within the PDF's viewport boundaries.
export const coordsAdjust = (oriCoords, viewport) => {
  let coords = oriCoords;
  const oriw = oriCoords[2] - oriCoords[0];
  const orih = oriCoords[3] - oriCoords[1];

  if (coords[0] < 0) {
    coords[0] = 0;
    coords[2] = oriw;
  }
  if (coords[2] > viewport.width) {
    coords[0] = viewport.width - oriw;
    coords[2] = viewport.width;
  }
  if (coords[1] < 0) {
    coords[1] = 0;
    coords[3] = orih;
  }
  if (coords[3] > viewport.height) {
    coords[1] = viewport.height - orih;
    coords[3] = viewport.height;
  }

  return coords;
};

// NOTE: my coord → my style
export const coord2Styles = (coords, viewport) => {
  if (!viewport) {
    return {
      position: "absolute",
      left: `0`,
      top: `0`,
      width: `0`,
      height: `0`,
    };
  }

  const leftOffset = coords[0];
  const topOffset = viewport.height - coords[3];
  const width = Math.abs(coords[0] - coords[2]);
  const height = Math.abs(coords[1] - coords[3]);

  return {
    position: "absolute",
    left: `${leftOffset}px`,
    top: `${topOffset}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
};

export const getNewCoord = (coords, viewport, direction) => {
  const transOri = viewport.transform;
  const trans = transOri.map((ele) => ele);
  const matrixTransform = [
    [trans[0], trans[1], 0],
    [trans[2], trans[3], 0],
    [trans[4], trans[5], 1],
  ];
  const matrix =
    direction === 1 ? matrixTransform : getMatrixInverse(matrixTransform);

  return getTransformResult(coords, matrix);
};

export const getMyCoord = (coords, viewport, rotate) => {
  // NOTE: pdf coord: (0, 0) bottom-left
  // NOTE: after transform: (0, 0) top-left
  const coordsNew = getNewCoord(coords, viewport, 1);
  const coordsRe = [coordsNew[0], viewport.height - coordsNew[1]];
  const width = Math.abs(coords[0] - coords[2]);
  const height = Math.abs(coords[1] - coords[3]);

  let coordsFinal;
  switch (rotate) {
    case 90:
    case -270:
      coordsFinal = [
        coordsRe[0],
        coordsRe[1] - width,
        coordsRe[0] + height,
        coordsRe[1],
      ];
      break;

    case 180:
    case -180:
      coordsFinal = [
        coordsRe[0] - width,
        coordsRe[1] - height,
        coordsRe[0],
        coordsRe[1],
      ];
      break;

    case 270:
    case -90:
      coordsFinal = [
        coordsRe[0] - height,
        coordsRe[1],
        coordsRe[0],
        coordsRe[1] + width,
      ];
      break;

    default:
      coordsFinal = [
        coordsRe[0],
        coordsRe[1],
        coordsRe[0] + width,
        coordsRe[1] + height,
      ];
      break;
  }

  return coordsFinal;
};

export const getPdfCoord = (coords, viewport, rotate) => {
  // NOTE: my transform: (0, 0) top-left
  // NOTE: pdf coord: (0, 0) bottom-left
  const coordsOri = [
    coords[0],
    viewport.height - coords[1],
    coords[2],
    viewport.height - coords[3],
  ];

  const coordsNew = getNewCoord(coordsOri, viewport, -1);
  const width = Math.abs(coords[0] - coords[2]);
  const height = Math.abs(coords[1] - coords[3]);

  let coordsRe;
  switch (rotate) {
    case 90:
    case -270:
      coordsRe = [
        coordsNew[0] - height,
        coordsNew[1],
        coordsNew[0],
        coordsNew[1] + width,
      ];
      break;

    case 180:
    case -180:
      coordsRe = [
        coordsNew[0] - width,
        coordsNew[1] - height,
        coordsNew[0],
        coordsNew[1],
      ];
      break;

    case 270:
    case -90:
      coordsRe = [
        coordsNew[0],
        coordsNew[1] - width,
        coordsNew[0] + height,
        coordsNew[1],
      ];
      break;

    default:
      coordsRe = [
        coordsNew[0],
        coordsNew[1],
        coordsNew[0] + width,
        coordsNew[1] + height,
      ];
      break;
  }

  return coordsRe;
};

export const getScaler = (containerWidth, viewport, zoomLevel) => {
  // NOTE: zoomLevel: zoomin/out
  if (!viewport) {
    return 1;
  }

  return (containerWidth / viewport.width) * zoomLevel;
};

// NOTE: for field insert
export const getFieldCoord = ({ panelType, x, y, heightContainer }) => {
  const b = heightContainer - y;
  let coords;
  switch (panelType) {
    case "checkbox":
    case "radio":
    case "checkboxGroup":
    case "radioGroup":
      coords = [x, b - 50, x + 50, b];
      break;
    default:
      coords = [x, b - 50, x + 180, b];
  }

  return coords;
};

const getMatrixInverse = (M) => {
  if (M.length !== M[0].length) {
    return;
  }

  let i = 0;
  let ii = 0;
  let j = 0;
  let dim = M.length;
  let e = 0;
  let I = [];
  let C = [];

  for (i = 0; i < dim; i += 1) {
    I[I.length] = [];
    C[C.length] = [];

    for (j = 0; j < dim; j += 1) {
      if (i === j) {
        I[i][j] = 1;
      } else {
        I[i][j] = 0;
      }
      C[i][j] = M[i][j];
    }
  }

  for (i = 0; i < dim; i += 1) {
    e = C[i][i];

    if (e === 0) {
      for (ii = i + 1; ii < dim; ii += 1) {
        if (C[ii][i] !== 0) {
          for (j = 0; j < dim; j++) {
            e = C[i][j];
            C[i][j] = C[ii][j];
            C[ii][j] = e;
            e = I[i][j];
            I[i][j] = I[ii][j];
            I[ii][j] = e;
          }
          break;
        }
      }

      e = C[i][i];
      if (e === 0) {
        return;
      }
    }

    for (j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e;
      I[i][j] = I[i][j] / e;
    }

    for (ii = 0; ii < dim; ii++) {
      if (ii === i) {
        continue;
      }

      e = C[ii][i];

      for (j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j];
        I[ii][j] -= e * I[i][j];
      }
    }
  }

  return I;
};

const getTransformResult = (coords, matrix) => {
  const x = matrix[0][0] * coords[0] + matrix[1][0] * coords[1] + matrix[2][0];
  const y = matrix[0][1] * coords[0] + matrix[1][1] * coords[1] + matrix[2][1];
  return [x, y];
};

// NOTE: for checkboxGroup or radioGroup replication coordinates
export const getFieldCoordOffset = (coords) => {
  return [coords[0], coords[1] - 60, coords[2], coords[3] - 60];
};

export default coord2Styles;
