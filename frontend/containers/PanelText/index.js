import React, { useState } from "react";
import scrollLock from "../../helpers/scrollLock";
import PanelText from "../../components/PanelText";

const PanelTextContainer = ({ onPanelClose, setSignature }) => {
  const [inputCur, setInputCur] = useState("");

  scrollLock({ targetId: "textBox" });

  const onChange = (val) => {
    setInputCur(val);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const val = e.target.value;
      setSignature({ raw: val });
      onPanelClose();
    }
  };

  const onConfirm = () => {
    setSignature({ raw: inputCur });
    onPanelClose();
  };

  return (
    <PanelText
      inputCur={inputCur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onConfirm={onConfirm}
      onPanelClose={onPanelClose}
    />
  );
};

export default PanelTextContainer;
