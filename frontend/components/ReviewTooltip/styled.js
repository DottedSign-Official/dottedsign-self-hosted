import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Content = styled.div`
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  background-color: ${gbColor.gray};
  font-size: 14px;
  font-weight: 500;
  color: white;
  width: max-content;
  z-index: 99;

  ${({ position }) =>
    (position === "bottom-right" &&
      css`
        top: 100%;
        left: 10px;
      `) ||
    (position === "bottom-left" &&
      css`
        top: 100%;
        right: 10px;
      `) ||
    (position === "top-right" &&
      css`
        bottom: 100%;
        left: 10px;
      `) ||
    (position === "top-left" &&
      css`
        bottom: 100%;
        right: 10px;
      `) ||
    (position === "left" &&
      css`
        top: 50%;
        transform: translateY(-50%);
        right: calc(100% + 10px);
      `) ||
    (position === "right" &&
      css`
        top: 50%;
        transform: translateY(-50%);
        left: calc(100% + 10px);
      `)}

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${({ position }) =>
      (position === "bottom-right" &&
        css`
          top: -8px;
          left: 8px;
          border-width: 0 5px 8px 5px;
          border-color: transparent transparent ${gbColor.gray} transparent;
        `) ||
      (position === "bottom-left" &&
        css`
          top: -8px;
          right: 8px;
          border-width: 0 5px 8px 5px;
          border-color: transparent transparent ${gbColor.gray} transparent;
        `) ||
      (position === "top-right" &&
        css`
          bottom: -8px;
          left: 8px;
          border-width: 8px 5px 0 5px;
          border-color: ${gbColor.gray} transparent transparent transparent;
        `) ||
      (position === "top-left" &&
        css`
          bottom: -8px;
          right: 8px;
          border-width: 8px 5px 0 5px;
          border-color: ${gbColor.gray} transparent transparent transparent;
        `) ||
      (position === "left" &&
        css`
          right: -8px;
          border-width: 5px 0 5px 8px;
          border-color: transparent transparent transparent ${gbColor.gray};
        `) ||
      (position === "right" &&
        css`
          left: -8px;
          border-width: 5px 8px 5px 0;
          border-color: transparent ${gbColor.gray} transparent transparent;
        `)}
  }
`;
