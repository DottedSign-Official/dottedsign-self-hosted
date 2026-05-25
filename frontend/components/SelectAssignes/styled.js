import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { InputElement } from "../../global/styledForm";

export const WrapperAssignes = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;

  &:focus {
    border: 1px solid ${gbColor.systemBlue};
  }
`;

const assigneStyle = css`
  ${InputElement};
  border: 1px solid rgba(0, 0, 0, 0);
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
`;

export const AssigneActive = styled.div`
  ${assigneStyle};
`;

export const Email = styled.div`
  width: calc(100% - 18px - 8px - 24px - 8px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: black;
  font-size: 14px;
  font-weight: 700;
  padding-left: 12px;
`;

export const WrapperDrop = styled.div`
  position: absolute;
  display: flex;
  top: calc(50% - 12px);
  right: 8px;
  z-index: 2;
  -webkit-transition: transform 0.3s;
  transition: transform 0.3s;

  ${(props) =>
    !props.isCollapse &&
    css`
      -moz-transform: rotate(-180deg);
      -webkit-transform: rotate(-180deg);
      -o-transform: rotate(-180deg);
      -ms-transform: rotate(-180deg);
      transform: rotate(-180deg);
    `};
`;

export const AssigneMenu = styled.div`
  position: absolute;
  top: calc(100% + 1px);
  max-height: 300px;
  overflow-y: auto;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  z-index: 2;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.38);
`;

export const Assigne = styled.div`
  ${assigneStyle};
  cursor: pointer;

  &:hover {
    background-color: ${gbColor.black12};
  }
`;
