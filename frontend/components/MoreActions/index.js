import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";
import { Wrapper, WrapperIcon, ActionMenu, ActionMenuItem } from "./styled";

const MoreActions = ({
  onToggle,
  divRef,
  handleDivBlur,
  isMenuVisible,
  actions,
}) => {
  return (
    <Wrapper tabIndex="0" ref={divRef} onBlur={handleDivBlur}>
      <WrapperIcon onClick={onToggle} tabIndex="0">
        <Icon type="moreHorizontal" size="20px" />
      </WrapperIcon>
      {isMenuVisible && (
        <ActionMenu>
          {actions.map((action) => (
            <ActionMenuItem
              key={`more-actions--action-${action.name}`}
              onClick={() => {
                action?.func();
                // NOTE: Auto closing
                onToggle();
              }}
            >
              <Icon type={action.iconType} size={action.iconSize} />
              {action.name}
            </ActionMenuItem>
          ))}
        </ActionMenu>
      )}
    </Wrapper>
  );
};

MoreActions.defaultProps = {
  isMenuVisible: false,
  actions: [],
};

MoreActions.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isMenuVisible: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      func: PropTypes.func.isRequired,
    }),
  ),
};

export default MoreActions;
