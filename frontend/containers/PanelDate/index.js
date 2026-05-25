import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import scrollLock from "../../helpers/scrollLock";
import { isExist } from "../../helpers/others";
import { dateFormatsSelection } from "../../constants/constants";
import PanelDate from "../../components/PanelDate";

const selections = dateFormatsSelection();

const PanelDateContainer = ({ setSignature, onPanelClose }) => {
  const [focus, setFocus] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.date_format) {
      const selected = selections.find(
        (sel) => sel.format === user.date_format,
      );

      if (isExist(selected)) {
        setFocus(selected);
      }
    }
  }, [user]);

  scrollLock({ targetId: "dateBox" });

  const onSelect = (idx) => {
    const selected = selections[idx];
    setFocus(selected);
  };

  const onConfirm = () => {
    setSignature({ raw: focus.text });
  };

  return (
    <PanelDate
      selections={selections}
      focus={focus}
      onSelect={onSelect}
      onConfirm={onConfirm}
      onPanelClose={onPanelClose}
    />
  );
};

export default PanelDateContainer;
