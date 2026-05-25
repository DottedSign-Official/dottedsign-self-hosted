import styled from "styled-components";
import { gbColor } from "../../global/styled";
import { Wrapper as IconWrapper } from "../Icon/styled";

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

export const ActionMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  bottom: auto;
  background-color: white;
  border-radius: 5px;
  box-shadow: 1px 1px 10px ${gbColor.black12};
  overflow: hidden;
  z-index: 100;

  white-space: nowrap;
  display: flex;
  flex-direction: column;
`;

export const ActionMenuItem = styled.button.attrs({ type: "button" })`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 168px;
  padding: 0.5em 0.5em;
  background-color: transparent;
  border: 0;
  font-size: 16px;

  &:hover,
  &:active {
    background-color: ${gbColor.hover};
  }

  & > ${IconWrapper} {
    margin: 0 0.5em;
  }
`;
