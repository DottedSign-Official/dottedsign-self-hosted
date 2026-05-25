import React, { useState, useEffect } from "react";
import scrollLock from "../../helpers/scrollLock";
import { textEncode } from "../../helpers/parser";
import regex from "../../constants/regex";
import PanelLink from "../../components/PanelLink";

const PanelLinkContainer = ({ onPanelClose, setSignature }) => {
  const [inputCur, setInputCur] = useState("");
  const [isValid, setIsValid] = useState(false);

  scrollLock({ targetId: "textBox" });

  const onChange = (e) => {
    const val = e.target.value;
    setInputCur(textEncode(val));
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!isValid) {
        return;
      }

      const val = e.target.value;
      setSignature({ raw: val });
      onPanelClose();
    }
  };

  const onConfirm = () => {
    if (!isValid) {
      return;
    }

    setSignature({ raw: inputCur });
    onPanelClose();
  };

  useEffect(() => {
    const tester = new RegExp(regex.link);
    const temp = tester.test(inputCur);
    setIsValid(temp);
  }, [inputCur]);

  return (
    <PanelLink
      isValid={isValid}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onConfirm={onConfirm}
      onPanelClose={onPanelClose}
    />
  );
};

export default PanelLinkContainer;
