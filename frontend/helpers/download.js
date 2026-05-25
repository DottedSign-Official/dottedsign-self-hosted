import saveAs from "file-saver";

export const downloadFromUrl = (isMobile, url, fileName, isEnvelope) => {
  if (typeof window === "undefined") {
    return;
  }

  if (isMobile) {
    window.open(url, "_blank", fileName);
  } else {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) =>
        saveAs(blob, `${fileName}.${isEnvelope ? "zip" : "pdf"}`),
      );
  }
};

export const downloadFromBlob = (isMobile, blob, fileName) => {
  if (typeof window === "undefined") {
    return;
  }

  if (isMobile) {
    const fileUrl = URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = fileName;
    link.click();
  } else {
    saveAs(blob, fileName);
  }
};

export function appendExtension(fileName, mimeType) {
  // NOTE: Only handle 7z case for now
  if (mimeType === "application/x-7z-compressed" && !fileName.endsWith(".7z")) {
    return fileName + ".7z";
  }

  return fileName;
}

export default downloadFromUrl;
