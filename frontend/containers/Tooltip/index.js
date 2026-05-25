import React, { useState } from "react";
import Tooltip from "../../components/Tooltip";

const TooltipContainer = ({ type, position }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const onEnter = () => setIsCollapse(false);
  const onLeave = () => setIsCollapse(true);
  const onToggle = () => setIsCollapse(!isCollapse);

  return (
    <Tooltip
      type={type}
      isCollapse={isCollapse}
      position={position}
      onEnter={onEnter}
      onLeave={onLeave}
      onToggle={onToggle}
    />
  );
};

export default TooltipContainer;
