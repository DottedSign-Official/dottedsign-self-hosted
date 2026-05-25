import React from "react";
import { Wrapper } from "./styled";

const Branch = ({ type, width, widthItem }) => (
  <Wrapper color={type} width={width} widthItem={widthItem} />
);

export default Branch;
