import styled, { css } from "styled-components";
import { gbColor, orderColor } from "../../../../global/styled";

export const Tag = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: ${(props) => orderColor[props.indx]};
`;

const focusedBgColor = "rgba(255, 255, 255, 0.8)";

export const WrapperCheck = styled.div`
  position: absolute;
  top: -3px;
  left: -3px;
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  border-radius: 5px;

  ${({ isHighlight }) =>
    isHighlight &&
    css`
      border: 1.5px solid ${gbColor.highlight_green};
      background-color: ${gbColor.highlight_yellow};
    `}

  ${({ isHighlight, isFocus }) =>
    isFocus &&
    css`
      background-color: ${isHighlight
        ? `color-mix(in srgb, ${gbColor.highlight_yellow}, ${focusedBgColor})`
        : focusedBgColor};
      box-shadow: 0 0 0 2px ${gbColor.purple};
    `};
`;

export const Back = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const Status = styled.div`
  position: absolute;
  top: ${(props) => (props.isSelectionField ? "-10px" : "3px")};
  left: ${(props) => (props.isSelectionField ? "-10px" : "3px")};
  width: 20px;
  height: 20px;
  border-radius: 100%;
  display: flex;
  flex-direction: center;
  align-items: center;

  @media (max-width: 767px) {
    top: ${(props) => (props.isSelectionField ? "-6px" : "3px")};
    left: ${(props) => (props.isSelectionField ? "-6px" : "3px")};
    width: 16px;
    height: 16px;
  }
`;

export const ButtonGroup = styled.div`
  display: inline-flex;
`;
