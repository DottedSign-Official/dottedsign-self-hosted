import { pdfjs } from "./react-pdf";
import { PDF_VIEWPORT_SCALE } from "../constants/constants";

export const isExist = (param) => {
  return (
    param !== "" &&
    param !== null &&
    param !== undefined &&
    param !== "undefined" &&
    typeof param !== "undefined"
  );
};

export const getPdfDocDataURL = async (doc) => {
  try {
    const data = await doc.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    const pdfDataUrl = URL.createObjectURL(blob);
    return pdfDataUrl;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getDocFile = async (doc, fileName = "document.pdf") => {
  try {
    const data = await doc.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    const file = new File([blob], fileName, { type: "application/pdf" });
    return file;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getDoc = async (url) => {
  try {
    const loadingTask = pdfjs.getDocument({
      url,
      cMapUrl: "/static/cmaps/",
      cMapPacked: true,
    });
    const doc = await loadingTask.promise;

    return doc;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getPDFPageNum = async (fileUrl) => {
  let doc = await getDoc(fileUrl);
  if (doc) {
    const numPages = doc._pdfInfo.numPages;
    doc.destroy();
    return numPages;
  }
  return null;
};

export const getPDFSize = async (fileUrl, pageNum) => {
  let doc = await getDoc(fileUrl);
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale: PDF_VIEWPORT_SCALE });
  doc.destroy();
  return {
    width: Math.round(viewport.width),
    height: Math.round(viewport.height),
  };
};

export const getDocAndFileSize = async (url) => {
  try {
    const response = await fetch(url);
    const fileSize = response.headers.get("content-length");
    const pdfData = await response.arrayBuffer();

    const loadingTask = pdfjs.getDocument({
      data: pdfData,
      cMapUrl: "/static/cmaps/",
      cMapPacked: true,
    });
    const doc = await loadingTask.promise;

    return { doc, fileSize };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const formatFileSize = (bytes) => {
  const mb = 1024 * 1024;

  const sizeInMB = Math.ceil((bytes / mb) * 100) / 100;

  return parseFloat(sizeInMB.toFixed(2)) + " MB";
};

export const getDocTotalPages = async (file) => {
  let pageNum;

  const fileUrl = URL.createObjectURL(file);
  const doc = await getDoc(fileUrl);

  if (doc) {
    pageNum = doc._pdfInfo.numPages;
    doc.destroy();
  }

  URL.revokeObjectURL(fileUrl);

  return pageNum;
};

export const getDocTotalPagesAndFileSize = async (file) => {
  const fileSize = file.size;
  let pageCount = 0;
  let width = 0;
  let height = 0;

  const fileUrl = URL.createObjectURL(file);
  const doc = await getDoc(fileUrl);
  if (doc) {
    pageCount = doc.numPages;
    if (pageCount > 0) {
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      width = Math.round(viewport.width);
      height = Math.round(viewport.height);
    }
    doc.destroy();
  }
  return { fileUrl, pageCount, fileSize, width, height };
};

const compare = (key, direction) => (a, b) => {
  if (!a[key] || !b[key]) {
    return 1;
  }

  const bandA = a[key].toUpperCase();
  const bandB = b[key].toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }

  return direction === "asc" ? comparison : comparison * -1;
};

export const orderBy = ({ list, key, direction }) => {
  const listCopy = [...list];

  return listCopy.sort(compare(key, direction));
};

export const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject({ error: true });
    }, ms);

    promise
      .then((res) => res.json())
      .then(
        (res) => {
          clearTimeout(timeoutId);
          resolve({ data: res });
        },
        (err) => {
          console.log(err);
          clearTimeout(timeoutId);
          reject({ error: true });
        },
      );
  });
};
