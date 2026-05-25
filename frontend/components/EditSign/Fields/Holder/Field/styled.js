import styled, { css } from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const DefaultText = styled.div`
  position: absolute;
  font-family: "Droid Sans", "Noto Sans TC", "Noto Sans SC", "Noto Sans JP",
    sans-serif;
  font-size: ${(props) => props.fontSize};
  font-weight: 500;
  color: ${(props) => (props.isValued ? gbColor.black87 : gbColor.black12)};
  color: ${(props) => (props.isValued ? "black" : "gray")};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: ${(props) => {
    if (props.alignment === "left") {
      return "flex-start";
    }
    if (props.alignment === "right") {
      return "flex-end";
    }
    return "center";
  }};
  overflow: hidden;

  ${(props) =>
    props.isMultiLine
      ? css`
          align-items: flex-start;
          white-space: pre-wrap;
        `
      : css`
          align-items: center;
          white-space: nowrap;
        `}
`;

export const CheckboxValue = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 100%;
    height: 100%;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const RadioValue = styled.div`
  width: 33%;
  height: 33%;
  border-radius: 100%;
  background-color: ${gbColor.black87};
`;

export const DefaultImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
