import React from "react";
import { Wrapper, Icon, Text } from "./styled";

const Toggle = ({ id, isActive, onToggle, text }) => (
  <Wrapper>
    <Icon id={id} isActive={isActive} onClick={onToggle} />
    <Text>{text}</Text>
  </Wrapper>
);

export default Toggle;
