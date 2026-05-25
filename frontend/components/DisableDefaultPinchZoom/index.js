import { useEffect } from "react";
import NextHead from "next/head";

const DisableDefaultPinchZoom = () => {
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);
    document.addEventListener("gestureend", preventDefault);
    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
      document.removeEventListener("gestureend", preventDefault);
    };
  }, []);

  return (
    <NextHead>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
    </NextHead>
  );
};

export default DisableDefaultPinchZoom;
