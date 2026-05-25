import React, { useRef, useState } from "react";
import SignBoard from "../../components/SignBoard";
import { useTranslation } from "next-i18next";

const Signboard = ({
  id,
  onClose,
  onSignSave,
  category,
  modes,
  currentMode,
  onModeChange,
}) => {
  const { t } = useTranslation("settings");
  const refCanvas = useRef(null);
  const timer = useRef(null);
  const frames = useRef([]);
  const [color, setColor] = useState("black");
  const [isValid, setIsValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSetColor = (val) => setColor(val);

  const getAndSetFrame = async () => {
    const canvas = refCanvas.current;
    const signFrame = await canvas.replaceDataURLBackground(
      canvas.toDataURL("image/png"),
    );
    frames.current.push(signFrame);
  };

  const onStart = () => {
    getAndSetFrame();

    if (timer.current) {
      clearInterval(timer.current);
    }

    timer.current = setInterval(() => {
      getAndSetFrame();
    }, 100);
  };

  const onStop = () => {
    clearInterval(timer.current);
    if (refCanvas.current.isSizeValid()) {
      setIsValid(true);
    }
  };

  const onClear = () => {
    setIsValid(false);

    if (refCanvas && refCanvas.current) {
      refCanvas.current.clear();
      frames.current = [];

      if (refCanvas.current.clearPenData) {
        refCanvas.current.clearPenData();
      }
    }
  };

  const onExport = () => {
    if (refCanvas && refCanvas.current) {
      // NOTE: get last frame
      getAndSetFrame().then(() => {
        setIsProcessing(true);

        const signTemp = refCanvas.current
          .getTrimmedCanvas()
          .toDataURL("image/png");

        const trim = signTemp.split("data:image/png;base64,")[1];

        // NOTE: get pen data as a string with enhanced format
        let stroke = "";
        if (refCanvas.current.getPenData) {
          const penData = refCanvas.current.getPenData();
          stroke = penData
            .map(
              (point) =>
                `${point.x},${point.y},${point.pressure},${point.timestamp},${
                  point.isNewStroke ? "true" : "false"
                }`,
            )
            .join("\n");
        }

        setIsProcessing(false);
        onSignSave({
          raw: trim,
          base64_images: frames.current,
          sign_stroke: stroke,
        });
      });
    }
  };

  return (
    <SignBoard
      t={t}
      refCanvas={refCanvas}
      id={id}
      modes={modes}
      currentMode={currentMode}
      color={color}
      category={category}
      isValid={isValid}
      isProcessing={isProcessing}
      onClose={onClose}
      onModeChange={onModeChange}
      onSetColor={onSetColor}
      onStart={onStart}
      onStop={onStop}
      onClear={onClear}
      onExport={onExport}
    />
  );
};

export default Signboard;
