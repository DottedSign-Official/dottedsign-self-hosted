import React from "react";
import Icon from "../Icon";
import { Box, RadioChecked } from "./styled";

const Checkbox = ({ id, isRadio, isChecked, isReadOnly, onToggle }) => (
  <Box
    id={id || ""}
    isRadio={isRadio}
    isChecked={isChecked}
    isReadOnly={isReadOnly}
    onClick={isReadOnly ? null : onToggle}
  >
    {isRadio
      ? isChecked && <RadioChecked isReadOnly={isReadOnly} />
      : isChecked && <Icon type="checkedSingle" size="14px" />}
  </Box>
);

export default Checkbox;
