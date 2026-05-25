import React from "react";
import PanelSign from "../../../containers/PanelSign";
import PanelDate from "../../../containers/PanelDate";
import PanelSystemTime from "../../../containers/PanelSystemTime";
import PanelText from "../../../containers/PanelText";
import PanelProfile from "../../../containers/PanelProfile";

import PanelLink from "../../../containers/PanelLink";
import PanelImage from "../../PanelImage";

const Panels = ({ focusPanel, onSignUpdate, onSignCancel }) => {
  let ToRender;

  const props = {
    onPanelClose: onSignCancel,
    setSignature: onSignUpdate,
  };

  if (!focusPanel) {
    return null;
  }

  if (focusPanel.type === "signature") {
    ToRender = PanelSign;
  } else if (focusPanel.type === "datefield") {
    ToRender = PanelDate;
  } else if (focusPanel.type === "textfield") {
    ToRender = PanelText;
  } else if (focusPanel.type === "profile") {
    ToRender = PanelProfile;
  } else if (focusPanel.type === "systemtime") {
    ToRender = PanelSystemTime;
  } else if (focusPanel.type === "link") {
    ToRender = PanelLink;
  } else if (focusPanel.type === "image") {
    ToRender = PanelImage;
  }

  if (!ToRender) {
    return null;
  }

  return <ToRender {...props} />;
};

export default Panels;
