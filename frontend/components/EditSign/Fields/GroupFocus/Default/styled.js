import styled, { css } from "styled-components";
import { gbColor, orderColor } from "../../../../../global/styled";

export const Element = styled.input`
  position: absolute;
  margin: 0;
  background-color: white;
  border-radius: 3px;
  accent-color: white;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  ${(props) => {
    const width = props.coords[2] - props.coords[0];
    const left = props.coords[0] - props.coordsFocus[0];
    const top = props.coordsFocus[3] - props.coords[3];

    return css`
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${width}px;
    `;
  }}

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border-radius: 3px;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props) =>
      props.isRequiredHint
        ? "red"
        : props.order !== -1
        ? orderColor[props.order]
        : gbColor.gray};
  }

  &[type="checkbox"] {
    &:checked:after {
      position: absolute;
      top: 3%;
      left: 30%;
      width: 33%;
      height: 60%;
      content: "";
      border-style: inset;
      border-color: black;
      border-width: 0 8px 8px 0;
      transform: rotate(45deg);
      transform-origin: 50%;
    }
  }

  &[type="radio"] {
    border-radius: 100%;

    &:before {
      border-radius: 100%;
    }

    &:checked:after {
      position: absolute;
      top: calc(50% - 16.5%);
      left: calc(50% - 16.5%);
      width: 33%;
      height: 33%;
      content: "";
      background-color: black;
      border-radius: 100%;
    }
  }
`;
