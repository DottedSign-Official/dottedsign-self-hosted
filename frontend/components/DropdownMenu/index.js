import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";
import {
  FloatMenu,
  FloatMenuItem,
  IconWrapper,
  FloatMenuWrapper,
} from "./styled";

const DropdownMenu = (
  { isOpen, onOpen, onClose, onDropdownBlur, children },
  ref,
) => {
  return (
    <FloatMenuWrapper tabIndex="-1" ref={ref} onBlur={() => onDropdownBlur()}>
      <IconWrapper onClick={isOpen ? onClose : onOpen}>
        <Icon type="moreHorizontal" size="20px" />
      </IconWrapper>
      <FloatMenu isVisible={isOpen} isAlignRight>
        {children}
      </FloatMenu>
    </FloatMenuWrapper>
  );
};

const ForwardComponent = React.forwardRef(DropdownMenu);

ForwardComponent.defaultProps = {
  isOpen: true,
  isWithInMenu: false,
  onOpen: () => null,
  onClose: () => null,
  onDropdownBlur: () => null,
  children: [],
};

ForwardComponent.propTypes = {
  isOpen: PropTypes.bool,
  isWithInMenu: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onDropdownBlur: PropTypes.func,
  children: PropTypes.node,
};

export { FloatMenuItem };

export default ForwardComponent;
