import React, { useState } from "react";
import PropTypes from "prop-types";
import MoreActions from "../../components/MoreActions";
import { useWithInDiv } from "../../helpers/customHooks";

const MoreActionsContainer = ({ actions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { divRef, isWithInDiv } = useWithInDiv();

  const handleToggle = () => {
    if (!actions.length) {
      return;
    }

    setIsVisible(!isVisible);
  };

  const handleDivBlur = () => {
    if (isVisible && !isWithInDiv) {
      setIsVisible(false);
    }
  };

  return (
    <MoreActions
      onToggle={handleToggle}
      divRef={divRef}
      handleDivBlur={handleDivBlur}
      isMenuVisible={isVisible}
      actions={actions}
    />
  );
};

MoreActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      func: PropTypes.func.isRequired,
    }),
  ),
};

export default MoreActionsContainer;
