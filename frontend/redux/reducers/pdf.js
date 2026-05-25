import { produce } from "immer";

import {
  SET_DOCUMENT,
  SET_VIEWPORT,
  SET_CURRENT_PAGE,
  SET_TOTAL_PAGE,
  SET_THUMBNAILS,
  RESET_PDF,
  SET_IS_MOBILE,
  SET_IS_RENDER_DONE,
  SET_TO_RENDER_PAGES,
} from "../../constants/pdfTypes";

const initialState = {
  pdfDocument: null,
  viewport: [],
  viewportContainer: [],
  pdfRotates: 0,
  thumbnails: [],
  currentPage: 1,
  totalPage: null,
  isMobile: false,
  isRenderDone: false,
  scale: 1,
  scaleArr: [],
};

const pdf = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_DOCUMENT:
        draft.pdfDocument = action.doc;
        break;

      case SET_VIEWPORT:
        draft.viewport =
          action.payload && action.payload.viewport
            ? action.payload.viewport
            : state.viewport;
        draft.viewportContainer =
          action.payload && action.payload.viewportContainer
            ? action.payload.viewportContainer
            : state.viewportContainer;
        draft.pdfRotates =
          action.payload && action.payload.rotates
            ? action.payload.rotates
            : state.pdfRotates;
        draft.scale =
          action.payload && action.payload.scale
            ? action.payload.scale
            : state.scale;
        draft.scaleArr =
          action.payload && action.payload.scaleArr
            ? action.payload.scaleArr
            : state.scaleArr;
        break;

      case SET_IS_RENDER_DONE:
        draft.isRenderDone = action.payload.isRenderDone;
        break;

      case SET_CURRENT_PAGE:
        draft.currentPage = action.currentPage;
        break;

      case SET_TOTAL_PAGE:
        draft.totalPage = action.totalPage;
        break;

      case RESET_PDF:
        Object.keys(initialState).forEach(
          (key) => (draft[key] = initialState[key]),
        );
        break;

      case SET_IS_MOBILE:
        draft.isMobile = action.payload.isMobile;
        break;

      case SET_THUMBNAILS:
        draft.thumbnails = action.payload;
        break;

      case SET_TO_RENDER_PAGES:
        draft.toRenderPages = action.payload;
        break;

      default:
        break;
    }
  });
};

export default pdf;
