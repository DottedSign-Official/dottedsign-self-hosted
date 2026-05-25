import styled, { css } from "styled-components";
import { gbColor, orderColor } from "../../../../global/styled";

const iconBack = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

export const Block = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border-width: 3px;
  border-style: dotted;
  border-color: ${(props) =>
    props.indx !== -1 ? orderColor[props.indx] : gbColor.gray};

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) =>
      props.indx !== -1 ? orderColor[props.indx] : "rgba(0, 0, 0, 0.16)"};
    opacity: 0.1;
    border-radius: 8px;
  }
`;

export const Required = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  height: 16px;
  max-width: 30%;
  max-height: 40%;
  display: flex;
  align-items: center;

  div {
    width: 14px;
    height: 14px;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const WrapperRequired = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  max-width: 30%;
  max-height: 40%;
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
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

export const BtnAdd = styled.div`
  position: absolute;
  left: -10px;
  bottom: -14px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
`;

export const IconPanel = styled.div`
  position: absolute;
  top: -14px;
  left: -10px;
  display: flex;
  align-items: center;
  z-index: 11;
`;

export const WrapperIcon = styled.div`
  ${iconBack};
  position: relative;
  border-radius: 100%;
  background-color: ${(props) => {
    if (props.isDisabled) {
      return "rgb(200, 200, 200)";
    }
    if (props.indx > -1) {
      return orderColor[props.indx];
    }
    return gbColor.gray;
  }};
  border: 2px solid white;
  margin-right: 2px;

  ${(props) =>
    props.isInvert &&
    css`
      svg {
        filter: brightness(0) invert(1);
      }
    `};
`;
