import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignInput from "./SignInput";
import Panel from "../../../../containers/PanelSign";
import PanelGuest from "../../../../containers/PanelSignGuest";
import SignBoardPhoto from "../../../../containers/SignBoardPhoto";
import { Wrapper } from "./styled";

const Signature = ({
  signId,
  isEdit,
  signed,
  options,
  setSignature,
  fontSize,
}) => {
  const timerSignRef = useRef();
  const timerPanelRef = useRef();
  const [isSignBox, setIsSignBox] = useState(false);
  const { isFastSigning } = useSelector((state) => state.sign);
  const isFrontDesk = useSelector((state) => state.auth.isFrontDesk);
  const { isFake } = useSelector((state) => state.auth);

  const isPhotoSignature = options?.photo || false;

  useEffect(() => {
    return () => {
      clearTimeout(timerSignRef.current);
      clearTimeout(timerPanelRef.current);
    };
  }, []);

  const onPanelClose = () => {
    clearTimeout(timerPanelRef.current);
    timerPanelRef.current = setTimeout(() => {
      setIsSignBox(false);
    }, 200);
  };

  const onSetSignature = (signObj) => {
    setSignature(signObj);
    onPanelClose();
  };

  const content = () => {
    if (!isEdit || !isSignBox) {
      return null;
    }

    const attr = { onPanelClose, setSignature: onSetSignature };

    if (isPhotoSignature) {
      return <SignBoardPhoto {...attr} signId={signId} />;
    }
    if (isFastSigning) {
      return <PanelGuest {...attr} />;
    }
    if (isFrontDesk) {
      return <PanelGuest {...attr} />;
    }
    if (isFake) {
      return <PanelGuest {...attr} />;
    }
    return <Panel {...attr} />;
  };

  return (
    <Wrapper
      tabIndex="3"
      onClick={() => (isEdit ? setIsSignBox(true) : {})}
      onBlur={() => (isEdit ? setIsSignBox(true) : {})}
    >
      <SignInput isEdit={isEdit} signature={signed} fontSize={fontSize} />

      {content()}
    </Wrapper>
  );
};

export default Signature;
