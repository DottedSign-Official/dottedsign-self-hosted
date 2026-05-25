import React, { useState } from "react";
import { Wrapper, Text, WrapperTooltip, Tooltip } from "./styled";

const TooltipExtend = ({ text, isCenter, isBold, position, textColor }) => {
  const [isTooltip, setIsTooltip] = useState(false);

  const onEnter = () => {
    setIsTooltip(true);
  };

  const onLeave = () => {
    setIsTooltip(false);
  };

  return (
    <Wrapper onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Text color={textColor} isCenter={isCenter} isBold={isBold}>
        {text}
      </Text>

      {isTooltip && (
        <WrapperTooltip position={position} isCenter={isCenter}>
          <Tooltip>{text}</Tooltip>
        </WrapperTooltip>
      )}
    </Wrapper>
  );
};

export default TooltipExtend;
