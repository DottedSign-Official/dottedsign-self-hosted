import React from "react";
import Date from "./Date";
import { Wrapper } from "./styled";

const Filter = ({ onSearch }) => (
  <Wrapper>
    <Date onSearch={onSearch} />
  </Wrapper>
);

export default Filter;
