import { useEffect, useRef } from "react";

const usePenData = (refCanvas) => {
  const penDataRef = useRef([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (refCanvas.current) {
      refCanvas.current.getPenData = () => penDataRef.current;
      refCanvas.current.clearPenData = () => {
        penDataRef.current = [];
      };
    }
  }, [refCanvas]);

  useEffect(() => {
    if (!refCanvas.current) {
      return;
    }
    const canvasEl = refCanvas.current.getCanvas();

    const pushPenData = (e, isNewStroke = false) => {
      const rect = canvasEl.getBoundingClientRect();
      const pressure = e.pressure > 0 ? e.pressure : 0.5; // NOTE: default for non-pressure devices
      const timestamp = Date.now(); // NOTE: timestamp in milliseconds
      penDataRef.current.push({
        x: +(e.clientX - rect.left).toFixed(2),
        y: +(e.clientY - rect.top).toFixed(2),
        pressure: +pressure.toFixed(2),
        timestamp,
        isNewStroke,
      });
    };

    const handlePointerDown = (e) => {
      isDrawing.current = true;
      pushPenData(e, true); // NOTE: Mark as new stroke
    };

    const handlePointerMove = (e) => {
      if (!isDrawing.current) {
        return;
      }
      pushPenData(e, false); // NOTE: Continue existing stroke
    };

    const handlePointerUp = (e) => {
      if (!isDrawing.current) {
        return;
      }
      isDrawing.current = false;
      pushPenData(e, false); // NOTE: End current stroke
    };

    const handlePointerCancel = () => {
      isDrawing.current = false;
    };

    canvasEl.addEventListener("pointerdown", handlePointerDown);
    canvasEl.addEventListener("pointermove", handlePointerMove);
    canvasEl.addEventListener("pointerup", handlePointerUp);
    canvasEl.addEventListener("pointercancel", handlePointerCancel);
    canvasEl.addEventListener("pointerleave", handlePointerUp);

    return () => {
      canvasEl.removeEventListener("pointerdown", handlePointerDown);
      canvasEl.removeEventListener("pointermove", handlePointerMove);
      canvasEl.removeEventListener("pointerup", handlePointerUp);
      canvasEl.removeEventListener("pointercancel", handlePointerCancel);
      canvasEl.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [refCanvas]);

  return penDataRef;
};

export default usePenData;
