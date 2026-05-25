import React, { useState, useEffect } from "react";
import MobileDetect from "mobile-detect";

const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }

  const query =
    "(-webkit-touch-enabled),(-moz-touch-enabled),(-o-touch-enabled),(-ms-touch-enabled)";
  return window.matchMedia(query).matches;
};

const WindowWidth = (Child) => {
  return function WindowWidthChild(props) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(null);
    const [browser, setBrowser] = useState(null);

    useEffect(() => {
      const md = new MobileDetect(window.navigator.userAgent);

      if (md.os() === "iOS" || md.os() === "AndroidOS" || isTouchDevice()) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      if (md.userAgent()) {
        setBrowser(md.userAgent());
      }

      onUpdateWindow();
      window.addEventListener("resize", onUpdateWindow);

      return () => {
        window.removeEventListener("resize", onUpdateWindow);
      };
    }, []);

    const onUpdateWindow = () => {
      setWindowWidth(window.innerWidth);
    };

    return (
      <Child
        {...props}
        isMobile={isMobile}
        browser={browser}
        windowWidth={windowWidth}
      />
    );
  };
};

export default WindowWidth;
