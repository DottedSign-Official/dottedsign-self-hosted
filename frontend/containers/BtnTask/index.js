import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import onBlur from "../../helpers/onBlur";
import BtnTask from "../../components/BtnTask";
import { useLicenseHook } from "../../helpers/license";
import { LICENSE_TYPE } from "../../constants/licenseTypes";

const BtnTaskContainer = () => {
  const Router = useRouter();

  const blurRef = useRef();
  const [isCollapse, setIsCollapse] = useState(true);

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  const onBtnToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onBtnBlur = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setIsCollapse(true))(e);
  };

  const onPrepareDoc = () => {
    if (typeof window !== "undefined") {
      Router.push("/create-task/prepare-doc");
    }
  };

  const onPrepareMyDoc = () => {
    if (typeof window !== "undefined") {
      Router.push("/sign-and-send/prepare-doc");
    }
  };

  const onPrepareEnvelopeDoc = () => {
    if (typeof window !== "undefined") {
      Router.push("/create-envelope/prepare-doc");
    }
  };

  const onFrontDesk = () => {
    Router.push("/front-desk");
  };

  const isFrontDesk = useLicenseHook(LICENSE_TYPE.KIOSK_TASK);

  return (
    <BtnTask
      isFrontDesk={isFrontDesk}
      isCollapse={isCollapse}
      onBtnToggle={onBtnToggle}
      onBtnBlur={onBtnBlur}
      onPrepareDoc={onPrepareDoc}
      onPrepareMyDoc={onPrepareMyDoc}
      onPrepareEnvelopeDoc={onPrepareEnvelopeDoc}
      onFrontDesk={onFrontDesk}
    />
  );
};

export default BtnTaskContainer;
