import React from "react";
import Icon from "../Icon";
import Menu from "../../containers/MoreMenu";
import { Wrapper, WrapperIcon } from "./styled";

const More = ({ isPopup, menu, isMenuUpward, onMenuToggle, onMenuClose }) => {
  // NOTE: components/More
  return (
    <Wrapper tabIndex={0} onBlur={onMenuClose}>
      <WrapperIcon onClick={onMenuToggle}>
        <Icon type="moreHorizontal" size="20px" />
      </WrapperIcon>

      {isPopup && <Menu menu={menu} isMenuUpward={isMenuUpward} />}
    </Wrapper>
  );
};

export default More;
