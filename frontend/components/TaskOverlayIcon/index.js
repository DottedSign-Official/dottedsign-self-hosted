import React from "react";
import Icon from "../Icon";
import { Wrapper } from "./styled";

const TaskOverlayIcon = ({ iconType = "envelopeBadge" }) => {
  return (
    <Wrapper>
      <Icon type={iconType} size="28px" />
    </Wrapper>
  );
};

export default TaskOverlayIcon;
