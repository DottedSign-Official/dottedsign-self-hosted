import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import * as signActions from "../../redux/actions/sign";
import { useLicenseHook } from "../../helpers/license";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import { SIGNATURE_CATEGORY } from "../../constants/constants";

import Portal from "../../components/Portal";
import SignBoard from "../../components/SignBoard";
import CameraFaceBox from "../../components/CameraFaceBox";
import useFaceDetection from "./useFaceDetection";

const SignBoardPhoto = ({ onPanelClose, setSignature, signId }) => {
  const { t } = useTranslation("settings");
  const refCanvas = useRef(null);
  const timer = useRef(null);
  const frames = useRef([]);
  const [color, setColor] = useState("black");
  const [isValid, setIsValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isFrontDesk } = useSelector((state) => state.auth);
  const { isLoading, isFastSigning } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const saveSign = (data) => dispatch(signActions.saveSign(data));
  const saveSignGuest = (data) => dispatch(signActions.saveSignGuest(data));

  const license = useLicenseHook(LICENSE_TYPE.SIGN_VIDEO);
  const onSetColor = (val) => setColor(val);

  const { videoRef, isFaceDetected, isFaceLoading, error, capturePhoto } =
    useFaceDetection();

  useEffect(() => {
    return () => {
      dispatch(signActions.clearSignGuest());
    };
  }, []);

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
    } else {
      setIsValid(false);
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

  const onSignSave = async (data) => {
    const callback = (signObj) => {
      setSignature(signObj);
    };

    const sign_photo = data.sign_photo;

    if (isFastSigning || isFrontDesk) {
      const payload = {
        raw: {
          raw: data.raw,
          base64_images: data.base64_images,
        },
        license,
        category: SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO,
        file_type: "png",
        sign_stroke: data.sign_stroke,
        sign_photo,
        signId,
        callback,
      };
      saveSignGuest(payload);
    } else {
      const payload = {
        ...data,
        license,
        category: SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO,
        file_type: "png",
        sign_photo,
        signId,
        callback,
      };
      saveSign(payload);
    }
  };

  const onExport = async () => {
    if (refCanvas && refCanvas.current && isFaceDetected) {
      try {
        // NOTE: get last frame
        await getAndSetFrame();

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

        const photo = await capturePhoto();

        onSignSave({
          raw: trim,
          base64_images: frames.current,
          sign_photo: photo,
          sign_stroke: stroke,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const cameraLoading = isFaceLoading || isLoading || isProcessing;

  return (
    <Portal>
      <CameraFaceBox
        videoRef={videoRef}
        isLoading={cameraLoading}
        error={error}
      />
      <SignBoard
        id="photo-sign-board"
        t={t}
        refCanvas={refCanvas}
        color={color}
        category={SIGNATURE_CATEGORY.SIGNATURE_WITH_PHOTO}
        isValid={isValid && isFaceDetected}
        isProcessing={isProcessing}
        isPhotoSignature
        onClose={onPanelClose}
        onSetColor={onSetColor}
        onStart={onStart}
        onStop={onStop}
        onClear={onClear}
        onExport={onExport}
      />
    </Portal>
  );
};

export default SignBoardPhoto;
