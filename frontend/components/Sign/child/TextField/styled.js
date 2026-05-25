import styled from "styled-components";
import { styleInput } from "../styled";
import { gbColor } from "../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${({ isTextarea }) =>
    isTextarea &&
    `
  position: relative;
  display: flex;
  `}
`;

export const Textarea = styled.textarea`
  ${styleInput};
  line-height: 1.3;

  @media (max-width: 767px) {
    padding: 0px !important;
  }
`;

export const Input = styled.input`
  ${styleInput};
  position: absolute;
`;

export const Error = styled.div`
  position: absolute;
  bottom: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  padding: 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  color: white;
  background-color: ${gbColor.warn};
  text-align: center;
  border-radius: 100%;
`;

export const ErrorText = styled.p`
  position: absolute;
  top: calc(100% + 10px);
  left: -3px;
  width: 150px;
  background-color: ${gbColor.warn};
  color: white;
  padding: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: keep-all;
  text-align: left;

  &:before {
    content: "";
    position: absolute;
    bottom: calc(100% - 2px);
    left: 5px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent ${gbColor.warn} transparent;
  }
`;
