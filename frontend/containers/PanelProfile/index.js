import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import scrollLock from "../../helpers/scrollLock";
import PanelProfile from "../../components/PanelProfile";

const PanelProfileContainer = ({ onPanelClose, setSignature }) => {
  const [focus, setFocus] = useState(null);
  const [selections, setSelections] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.profile) {
      const temp = [];
      const keysProfile = [
        "email",
        "first_name",
        "full_name",
        "telephone",
        "nationality",
        "organization",
      ];

      keysProfile.forEach((key) => {
        if (user.profile[key]) {
          temp.push({
            key,
            value: user.profile[key],
          });
        }
      });
      setSelections(temp);
    }
  }, [user]);

  scrollLock({ targetId: "profileBox" });

  const onSelect = (item) => {
    setFocus(item);
  };

  const onConfirm = () => {
    setSignature({ raw: focus.value });
    onPanelClose();
  };

  return (
    <PanelProfile
      focus={focus}
      selections={selections}
      onSelect={onSelect}
      onConfirm={onConfirm}
      onPanelClose={onPanelClose}
    />
  );
};

export default PanelProfileContainer;
