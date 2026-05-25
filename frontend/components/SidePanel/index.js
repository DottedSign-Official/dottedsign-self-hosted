import React, { useState } from "react";
import Icon from "../Icon";
import {
  SidePanelWrapper,
  SidePanelTrigger,
  SidePanelTextIcon,
  SidePanelHeader,
  SidePanelClose,
} from "./styled";
import dataset from "./data";

const SidePanel = ({ type, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const label = dataset[type];

  return (
    <>
      <SidePanelTrigger
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-label={`Open ${label} panel`}
      >
        <SidePanelTextIcon>{label}</SidePanelTextIcon>
      </SidePanelTrigger>
      <SidePanelWrapper isOpen={isOpen}>
        <SidePanelHeader>
          <SidePanelClose onClick={handleClose} aria-label="Close panel">
            <Icon type="arrowRight" />
          </SidePanelClose>
        </SidePanelHeader>
        {children}
      </SidePanelWrapper>
    </>
  );
};

export default SidePanel;
