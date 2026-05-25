import React, { useState } from "react";
import scrollLock from "../../helpers/scrollLock";
import { systemTimeSetting } from "../../constants/constants";
import PanelSystemTime from "../../components/PanelSystemTime";
import { systemTimeI18Keys } from "../../constants/constants";
import { useTranslation } from "next-i18next";

const selections = systemTimeSetting;

const PanelSystemTimeContainer = ({ setSignature, onPanelClose }) => {
  const { t } = useTranslation("create");

  const [focus, setFocus] = useState(selections[0]);

  scrollLock({ targetId: "systemTimeBox" });

  const onSelect = (idx) => {
    const selected = selections[idx];
    setFocus(selected);
  };

  const onConfirm = () => {
    setSignature({
      raw: t(systemTimeI18Keys[focus.key]),
      options: {
        format: focus.key,
        read_only: true,
      },
    });
  };

  return (
    <PanelSystemTime
      selections={selections}
      focus={focus}
      onSelect={onSelect}
      onConfirm={onConfirm}
      onPanelClose={onPanelClose}
    />
  );
};

export default PanelSystemTimeContainer;
