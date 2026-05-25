import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const ColumnMenuWrapper = styled.div`
  position: absolute;
  top: 95%;
  left: 0;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
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

export const ColumnMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 168px;
  padding: 0.5em 0.5em;
  background-color: ${({ isActive }) => (isActive ? `#f4f4f4` : "transparent")};
  border: 0;
  font-size: 16px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;

  &:hover,
  &:active {
    background-color: ${gbColor.hover};
  }
`;
