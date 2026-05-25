import * as types from "../../constants/pdfTypes";

export const setDocument = (doc) => {
  return { type: types.SET_DOCUMENT, doc };
};

export const setViewport = (payload) => {
  return { type: types.SET_VIEWPORT, payload };
};

export const setCurrentPage = (currentPage) => {
  return { type: types.SET_CURRENT_PAGE, currentPage };
};

export const setTotalPage = (totalPage) => {
  return { type: types.SET_TOTAL_PAGE, totalPage };
};

export const setIsRenderDone = (payload) => {
  return { type: types.SET_IS_RENDER_DONE, payload };
};

export const resetPdf = () => {
  return { type: types.RESET_PDF };
};

export const setIsMobile = (data) => {
  return { type: types.SET_IS_MOBILE, payload: data };
};

export const setThumbnails = (data) => {
  return { type: types.SET_THUMBNAILS, payload: data };
};

export const setToRenderPages = (data) => {
  return { type: types.SET_TO_RENDER_PAGES, payload: data };
};
