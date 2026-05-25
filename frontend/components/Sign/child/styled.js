import styled, { css } from "styled-components";
import { InputElement } from "../../../global/styledForm";

export const styleInput = css`
  ${InputElement};
  position: relative;
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : "16px")};
  text-align: ${(props) => props.alignment || "left"};
  line-height: 1;
  overflow: hidden;
  resize: none;
  padding: 0 !important;

  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0);
  padding: 2px;
  padding-left: 5px;
  font-weight: 400;
  border-radius: 0;

  &::placeholder {
    font-size: ${(props) => (props.$fontSize ? props.$fontSize : "16px")};
    text-align: center;
    color: rgba(100, 100, 100, 0.5);
    line-height: 100%;
    height: 100%;
  }

  @media (max-width: 767px) {
    padding: 2px !important;
    padding-left: 5px !important;
  }
`;

export const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  font-family: "Droid Sans", "Noto Sans TC", "Noto Sans SC", "Noto Sans JP",
    sans-serif;
  line-height: 1.3;
  font-weight: 500;
  color: rgba(100, 100, 100, 0.5);
  justify-content: ${(props) => props.alignment || "left"};
  font-size: ${(props) => props.fontSize};
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
