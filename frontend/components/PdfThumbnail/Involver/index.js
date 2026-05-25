import React, { useState } from "react";
import { Wrapper, ToolTip, Text } from "./styled";

const Involver = ({ inv }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Wrapper
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      user={inv}
    >
      {isHover && <ToolTip>{inv.name}</ToolTip>}
      {!inv.icon && <Text>{inv.name.charAt(0)}</Text>}
    </Wrapper>
  );
};

export default Involver;
