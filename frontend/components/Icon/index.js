import React from "react";
import data from "./data";
import { Wrapper, Content } from "./styled";

const Icon = ({ id, className, type, src, size }) => {
  const attr = {
    id,
    className,
    src: data[type] ? `/static/${data[type]}.svg` : src,
  };

  return (
    <Wrapper size={size} role="img" aria-label="icon">
      <Content {...attr} />
    </Wrapper>
  );
};

export default Icon;
