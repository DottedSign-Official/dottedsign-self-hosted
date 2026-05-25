import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { getServerTimestamp, applyDateWatermarkToCanvas } from "./helpers";

// NOTE: avoid reloading models every time
let faceApiModelPromise = null;

const useFaceDetection = () => {
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isFaceLoading, setIsFaceLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const loadModels = async () => {
    if (!faceApiModelPromise) {
      faceApiModelPromise = Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/static/models"),
      ]);
    }
    return faceApiModelPromise
      .then(() => true)
      .catch((err) => {
        console.error("Error loading face-api models:", err);
        setError("camera_face_model_error");
        return false;
      });
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("camera_not_supported");
      setIsFaceLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 240,
          height: 200,
          facingMode: "user", // NOTE: front camera
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsFaceLoading(false);
          startFaceDetection();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("camera_not_supported");
      setIsFaceLoading(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // NOTE: init
  useEffect(() => {
    const init = async () => {
      const modelsLoaded = await loadModels();
      if (modelsLoaded) {
        await startCamera();
      }
    };

    init();

    return () => {
      stopCamera();
    };
  }, []);

  const startFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(),
          );
          setIsFaceDetected(detections.length > 0);
          if (detections.length > 0) {
            setError(null);
          } else {
            setError("camera_face_align");
          }
        } catch (err) {
          setIsFaceDetected(false);
          setError("camera_face_align");
        }
      }
    }, 500);
  };

  const createPhotoCanvas = useCallback(async () => {
    if (!videoRef.current || !isFaceDetected) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.scale(-1, 1);
    context.drawImage(videoRef.current, -canvas.width, 0);

    try {
      const timestamp = await getServerTimestamp();
      const watermarkedCanvas = await applyDateWatermarkToCanvas(
        canvas,
        timestamp,
      );

      return watermarkedCanvas;
    } catch (error) {
      return canvas;
    }
  }, [isFaceDetected]);

  const capturePhoto = useCallback(async () => {
    const canvas = await createPhotoCanvas();
    if (!canvas) {
      return null;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png");
      return dataUrl.split("data:image/png;base64,")[1];
    } catch (err) {
      console.error("Error capturing photo:", err);
      return null;
    }
  }, [isFaceDetected]);

  return {
    videoRef,
    isFaceDetected,
    isFaceLoading,
    error,
    stopCamera,
    capturePhoto,
  };
};

export default useFaceDetection;
