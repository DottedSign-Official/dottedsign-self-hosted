import React from "react";
import Icon from "../../Icon";
import { Wrapper, WrapperIcon } from "./styled";

const Item = ({ className, icon, iconSize, text, onClickEvent }) => {
  return (
    <Wrapper className={className} onClick={onClickEvent}>
      <WrapperIcon>
        <Icon type={icon} size={iconSize} />
      </WrapperIcon>
      <p>{text}</p>
    </Wrapper>
  );
};

export default Item;
