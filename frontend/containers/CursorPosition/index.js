import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import {
  coordsAdjust,
  getFieldCoord,
  getScaler,
} from "../../helpers/coord2Styles";
import { panelTypes } from "../../constants/constants";
import WindowWidth from "../WindowWidth";
import { Anchor } from "./styled";

const CursorPosition = ({ isMobile, parentId, focusPanel, onInsertDone }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  const { viewport, currentPage } = useSelector((state) => state.pdf);

  const [scaler, setScaler] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  const onUpdateContainer = useCallback(() => {
    if (!document.getElementById(parentId)) {
      return;
    }

    const wid = document.getElementById(parentId).clientWidth;
    setContainerWidth(wid);
  }, [parentId]);

  useEffect(() => {
    if (viewport.length > 0) {
      onUpdateContainer();
    }
  }, [viewport.length, onUpdateContainer]);

  useEffect(() => {
    window.addEventListener("resize", onUpdateContainer);

    return () => {
      window.removeEventListener("resize", onUpdateContainer);
    };
  }, [onUpdateContainer]);

  const onMouseMove = useCallback(
    (e) => {
      const container = document.getElementById(parentId);

      if (container.contains(e.target)) {
        if (!isVisible) {
          setIsVisible(true);
        }

        setAnchorPosition({
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        if (isVisible) {
          setIsVisible(false);
        }
      }
    },
    [parentId, isVisible],
  );

  const onAnchored = useCallback(
    (e) => {
      const pdfBoundary = document.getElementById(parentId);

      let posObj = null;
      if (pdfBoundary.contains(e.target)) {
        const pageId =
          e.target.closest(".page")?.id || e.target.querySelector(".page")?.id;
        const pageNum = pageId.substring(13);
        const page = document.getElementById(pageId);

        let x = e.clientX - page.getBoundingClientRect().left;
        let y = e.clientY - page.getBoundingClientRect().top;

        const coords = getFieldCoord({
          panelType: focusPanel.type,
          x: x / scaler,
          y: y / scaler,
          heightContainer: viewport[pageNum - 1].height,
        });

        const coordsFix = coordsAdjust(coords, viewport[pageNum - 1]);

        posObj = {
          page: pageNum,
          coords: coordsFix,
        };
      }

      onInsertDone(posObj);
    },
    [onInsertDone, parentId, scaler, focusPanel.type, viewport],
  );

  useEffect(() => {
    const curScale = getScaler(containerWidth, viewport[currentPage - 1], 1);

    setScaler(curScale);
  }, [containerWidth, viewport, currentPage]);

  useEffect(() => {
    const container = document.getElementById(parentId);
    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove, parentId]);

  useEffect(() => {
    let t = setTimeout(() => {
      document.body.style.cursor = "move";
      if (isMobile) {
        document.addEventListener("touchstart", onAnchored);
      } else {
        document.addEventListener("click", onAnchored);
      }
    }, 0);

    return () => {
      clearTimeout(t);
      document.body.style.cursor = "initial";
      if (isMobile) {
        document.removeEventListener("touchstart", onAnchored);
      } else {
        document.removeEventListener("click", onAnchored);
      }
    };
  }, [scaler, isMobile, onAnchored]);

  let widthPx;
  let borderRadius;
  switch (focusPanel.type) {
    case panelTypes.radio:
    case panelTypes.radioGroup:
      widthPx = 50;
      borderRadius = "100%";
      break;

    case panelTypes.checkbox:
    case panelTypes.checkboxGroup:
      widthPx = 50;
      borderRadius = "8px";
      break;

    default:
      widthPx = 180;
      borderRadius = "8px";
  }

  const container = document.getElementById(parentId);
  const content = (
    <Anchor
      id="myCursor"
      style={{
        top: `${anchorPosition.y + 1}px`,
        left: `${anchorPosition.x + 1}px`,
        width: `calc(${widthPx}px * ${scaler})`,
        height: `calc(50px * ${scaler})`,
        borderRadius: `${borderRadius}`,
        opacity: `${isVisible ? "1" : "0"}`,
      }}
    >
      <p>Click to insert</p>
    </Anchor>
  );

  return ReactDOM.createPortal(content, container);
};

export default WindowWidth(CursorPosition);
