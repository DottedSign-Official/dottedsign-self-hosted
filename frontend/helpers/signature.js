import { useEffect } from "react";

export const useSignCache = () => {
  useEffect(() => {
    window.addEventListener("beforeunload", onClearCache);

    return () => {
      onClearCache();
      window.removeEventListener("beforeunload", onClearCache);
    };
  }, []);

  const onCacheSignature = (signObj) => {
    const workId = sessionStorage.getItem("dottedsign_work_id");
    const key = `signature-${workId}`;
    const value = JSON.stringify(signObj);
    sessionStorage.setItem(key, value);
  };

  const onClearCache = () => {
    const workId = sessionStorage.getItem("dottedsign_work_id");
    const key = `signature-${workId}`;
    sessionStorage.removeItem(key);
  };

  return { onCacheSignature };
};
