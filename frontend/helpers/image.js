import moment from "moment";
import { getFileFormat } from "./parser";

export const getImageFormat = (type) => {
  if (type.indexOf("jpg") > -1) {
    return "jpg";
  }
  if (type.indexOf("jpeg") > -1) {
    return "jpeg";
  }
  if (type.indexOf("png") > -1) {
    return "png";
  }
  if (type.indexOf("svg") > -1) {
    return "svg";
  }
  if (type.indexOf("gif") > -1) {
    return "gif";
  }
  if (type.indexOf("pdf") > -1) {
    return "pdf";
  }

  return null;
};

export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement("canvas");
        const width = Math.min(500, img.width);
        const scaleFactor = width / img.width;
        elem.width = width;
        elem.height = img.height * scaleFactor;

        const ctx = elem.getContext("2d");
        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
        ctx.canvas.toBlob(
          (blob) => {
            const dataUrl = elem.toDataURL();
            const n = dataUrl.indexOf("base64,");

            resolve({
              file_type: getFileFormat(blob.type),
              preview: dataUrl,
              raw: dataUrl.substring(n + 7),
              file: new File([blob], file.name, { type: blob.type }),
            });
          },
          file.type,
          1,
        );
      };
    };
  });
};

export const addTimeToURL = (src) => {
  const url = new URL(src);
  url.searchParams.append("time", moment().unix());
  return url.href;
};
