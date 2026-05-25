import React, { useState } from "react";
import MoreComponent from "../../components/More";

// NOTE: containers/More
const MoreContainer = ({ menu, isMenuUpward }) => {
  const [isPopup, setIsPopup] = useState(false);

  const onMenuToggle = () => {
    setIsPopup(!isPopup);
  };

  const onMenuClose = () => {
    setIsPopup(false);
  };

  return (
    <MoreComponent
      isPopup={isPopup}
      menu={menu}
      isMenuUpward={isMenuUpward}
      onMenuToggle={onMenuToggle}
      onMenuClose={onMenuClose}
    />
  );
};

export default MoreContainer;
