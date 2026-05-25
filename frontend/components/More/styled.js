import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const WrapperIcon = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 100%;

  &:hover,
  &:focus {
    background-color: ${gbColor.hover};
  }
`;
