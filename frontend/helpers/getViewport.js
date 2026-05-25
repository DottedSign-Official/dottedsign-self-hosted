import { PDF_VIEWPORT_SCALE } from "../constants/constants";

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

const getAllViewport = async (doc) => {
  try {
    if (!doc || !doc._transport || doc._transport.destroyed) {
      return null;
    }

    const promises = [...Array(doc.numPages)].map((_, idx) => {
      return doc.getPage(idx + 1);
    });

    let viewport = [];
    let viewportContainer = [];
    let viewportForScaleCalc = [];
    let rotates = [];

    const pages = await Promise.all(promises);

    await timeout(300);
    const pgWidth = document.getElementById("viewer")
      ? document.getElementById("viewer").clientWidth
      : 1024;

    pages.forEach((page) => {
      const vp = page.getViewport({ scale: PDF_VIEWPORT_SCALE });
      viewport.push(vp);

      viewportContainer.push({
        width: vp.width,
        height: vp.height,
      });

      viewportForScaleCalc.push({
        width: vp.width > pgWidth ? pgWidth : vp.width,
        height:
          vp.width > pgWidth
            ? parseFloat((pgWidth / vp.width).toFixed(3)) * vp.height
            : vp.height,
      });

      rotates.push(page.rotate);
    });

    // NOTE: scale
    const scaleArr = viewport.map((vp) =>
      parseFloat((pgWidth / vp.width).toFixed(3)),
    );
    const scale = Math.min(...scaleArr);

    return { viewport, viewportContainer, rotates, scale, scaleArr };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default getAllViewport;
