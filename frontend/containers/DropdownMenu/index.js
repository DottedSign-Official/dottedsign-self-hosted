import React, { useState } from "react";
import DropdownMenu, { FloatMenuItem } from "../../components/DropdownMenu";
import { useWithInDiv } from "../../helpers/customHooks";

const DropdownMenuContainer = ({ ...restProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { divRef, isWithInDiv } = useWithInDiv();
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDropdownBlur = () => {
    if (!isWithInDiv) {
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu
      ref={divRef}
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      onDropdownBlur={handleDropdownBlur}
      {...restProps}
    />
  );
};

export { FloatMenuItem };

export default DropdownMenuContainer;
