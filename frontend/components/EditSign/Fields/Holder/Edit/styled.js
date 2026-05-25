import styled, { css } from "styled-components";
import {
  gbColor,
  orderColor,
  readOnlyColor,
} from "../../../../../global/styled";

const iconBack = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

export const IconPanel = styled.div`
  position: absolute;
  top: -18px;
  left: -8px;
  display: flex;
  align-items: center;
`;

export const WrapperIcon = styled.div`
  ${iconBack};
  position: relative;
  border-radius: 100%;
  background-color: ${(props) => {
    if (props.readOnly) {
      return readOnlyColor;
    }
    if (props.indx > -1) {
      return orderColor[props.indx];
    }
    return gbColor.gray;
  }};
  border: 2px solid white;
  margin-right: 2px;
`;

export const Resize = styled.div`
  ${iconBack};
  right: -8px;
  bottom: -8px;
  width: 18px;
  height: 18px;
  border-bottom-right-radius: 5px;

  ${(props) => {
    const color = (() => {
      if (props.isDisabled) {
        return gbColor.black12;
      }
      if (props.indx > -1) {
        return orderColor[props.indx];
      }
      return gbColor.gray;
    })();

    return css`
      border-right: 3px solid ${color};
      border-bottom: 3px solid ${color};
    `;
  }};
`;

export const Border = styled.div`
  width: 100%;
  height: 100%;

  cursor: grab;

  outline-width: 2px;
  outline-style: dotted;
  border-radius: 5px;
  outline-color: rgba(0, 0, 0, 0);
  ${(props) =>
    props.indx !== -1 &&
    css`
      outline-color: ${props.readOnly ? readOnlyColor : orderColor[props.indx]};
    `};
`;
