const rgbToYuv = (r, g, b) => {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const u = -0.14713 * r - 0.28886 * g + 0.436 * b;
  const v = 0.615 * r - 0.51498 * g - 0.10001 * b;
  return [y, u, v];
};

const colorDistance = (r1, g1, b1, r2, g2, b2) => {
  const [y1, u1, v1] = rgbToYuv(r1, g1, b1);
  const [y2, u2, v2] = rgbToYuv(r2, g2, b2);

  const deltaY = y2 - y1;
  const deltaU = u2 - u1;
  const deltaV = v2 - v1;
  return Math.sqrt(deltaY * deltaY + deltaU * deltaU + deltaV * deltaV);
};

export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = reject;
    image.src = src;
  });
};

export const removeImageColor = async ({
  image,
  backgroundColors,
  threshold,
  canvas,
}) => {
  const context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    if (
      backgroundColors.some(
        (backgroundColor) =>
          colorDistance(
            red,
            green,
            blue,
            backgroundColor[0],
            backgroundColor[1],
            backgroundColor[2],
          ) <= threshold,
      )
    ) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  context.putImageData(imageData, 0, 0);
};
