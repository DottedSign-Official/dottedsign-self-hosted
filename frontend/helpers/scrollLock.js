import { useEffect } from "react";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

const ScrollLock = ({ targetId }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollEle = document.querySelector(`#${targetId}`);
      disableBodyScroll(scrollEle);
    }, 200);

    return () => {
      clearAllBodyScrollLocks();
      clearTimeout(timer);
    };
  }, [targetId]);
};

export default ScrollLock;
