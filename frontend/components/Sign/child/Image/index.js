import React, { useRef, useEffect, useState } from "react";
import SignInput from "./SignInput";
import Panel from "../../../PanelImage";
import { Wrapper } from "./styled";

const Image = ({ signId, isEdit, signed, setSignature, options }) => {
  const timerSignRef = useRef();
  const timerPanelRef = useRef();
  const [isSignBox, setIsSignBox] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(timerSignRef.current);
      clearTimeout(timerPanelRef.current);
    };
  }, []);

  const onSetSignature = (signObj) => {
    setSignature(signObj);

    clearTimeout(timerSignRef.current);
    timerSignRef.current = setTimeout(() => {
      setIsSignBox(false);
    }, 200);
  };

  const onPanelClose = () => {
    clearTimeout(timerPanelRef.current);
    timerPanelRef.current = setTimeout(() => {
      setIsSignBox(false);
    }, 0);
  };

  const contentPanel = () => {
    if (!isEdit || !isSignBox) {
      return null;
    }

    const attr = { onPanelClose, signed, setSignature: onSetSignature };

    return <Panel {...attr} />;
  };

  return (
    <Wrapper
      tabIndex="3"
      onClick={() => (isEdit ? setIsSignBox(true) : {})}
      onBlur={() => (isEdit ? setIsSignBox(true) : {})}
    >
      <SignInput
        signId={signId}
        isEdit={isEdit}
        signature={signed}
        options={options}
      />

      {contentPanel()}
    </Wrapper>
  );
};

export default Image;
