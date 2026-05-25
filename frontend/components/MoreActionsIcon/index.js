import React from "react";
import Icon from "../Icon";
import { WrapperIcon } from "./styled";
import {} from "./styled";

const MoreActionsIcon = ({ onToggle }) => (
  <WrapperIcon onClick={onToggle} tabIndex="0">
    <Icon type="moreHorizontal" size="20px" />
  </WrapperIcon>
);

export default MoreActionsIcon;
