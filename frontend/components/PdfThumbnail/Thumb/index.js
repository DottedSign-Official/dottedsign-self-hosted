import React, { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector, useDispatch } from "react-redux";
import { setThumbnails } from "../../../redux/actions/pdf";
import Loader from "../../Loaders/PdfThumbnail";
import Involver from "../Involver";
import { Thumb, ThumbOrder, Thumbnail, WrapperInvolvers, More } from "./styled";

const getUrl = async (doc, pg, vp) => {
  const canvas = document.createElement(`canvas`);
  const page = await doc.getPage(pg);
  canvas.width = vp.width;
  canvas.height = vp.height;

  const ctx = {
    canvasContext: canvas.getContext("2d"),
    viewport: vp,
  };

  return page.render(ctx).promise.then(() => {
    return canvas.toDataURL();
  });
};

const ThumbComponent = ({
  id,
  isFocus,
  involvers,
  fileFocus,
  onChangePage,
}) => {
  const { ref, inView } = useInView();

  const refThumbnails = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [myThumb, setMyThumb] = useState();
  const { thumbnails, pdfDocument, viewport } = useSelector(
    (state) => state.pdf,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(false);
  }, [fileFocus]);

  useEffect(() => {
    refThumbnails.current = thumbnails;
  }, [thumbnails]);

  useEffect(() => {
    if (inView && !isLoaded) {
      const genThumb = async () => {
        const src = await getUrl(pdfDocument, id, viewport[id - 1]);
        const thumbs = refThumbnails.current ? refThumbnails.current : [];
        const thmb = {
          page: id,
          src,
        };

        setIsLoaded(true);
        setMyThumb(thmb);

        dispatch(setThumbnails([...thumbs, thmb]));
      };

      genThumb();
    }
  }, [inView, isLoaded, viewport, id, pdfDocument, dispatch]);

  return (
    <Thumb
      id={`thumb_${id}`}
      ref={ref}
      isFocus={isFocus}
      onClick={() => onChangePage(id)}
    >
      <ThumbOrder isFocus={isFocus}>{id}</ThumbOrder>

      {isLoaded && myThumb ? <Thumbnail src={myThumb.src} /> : <Loader />}

      {involvers && (
        <WrapperInvolvers>
          {involvers.map(
            (inv, indx) => indx < 6 && <Involver key={indx} inv={inv} />,
          )}

          {involvers.length > 6 && <More>{"..."}</More>}
        </WrapperInvolvers>
      )}
    </Thumb>
  );
};

export default ThumbComponent;
