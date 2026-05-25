import React, { useState } from "react";
import scrollLock from "../../helpers/scrollLock";
import PanelSign from "../../components/PanelSign";
import MySigns from "../../containers/MySigns";
import MyStamps from "../../containers/MyStamps";

const MODE = {
  SIGN: "SIGN",
  STAMP: "STAMP",
};

const modes = [
  {
    idx: "modesign",
    key: MODE.SIGN,
    text: "mode_sign",
  },
  {
    idx: "modestamp",
    key: MODE.STAMP,
    text: "mode_stamp",
  },
];

const Panel = ({ onPanelClose, setSignature }) => {
  const [mode, setMode] = useState(MODE.SIGN);
  const [focus, setFocus] = useState(null);

  scrollLock({ targetId: "signBox" });

  const onModeChange = (key) => {
    setMode(key);
    setFocus(null);
  };

  const onConfirm = () => {
    setSignature(focus);
    onPanelClose();
  };

  const modeComponents = {
    [MODE.SIGN]: <MySigns onSelect={setFocus} />,
    [MODE.STAMP]: <MyStamps onSelect={setFocus} />,
  };

  return (
    <PanelSign
      modes={modes}
      modeComponents={modeComponents}
      mode={mode}
      focus={focus}
      onModeChange={onModeChange}
      onPanelClose={onPanelClose}
      onConfirm={onConfirm}
    />
  );
};

export default Panel;
