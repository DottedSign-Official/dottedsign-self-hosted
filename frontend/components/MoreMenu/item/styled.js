import styled, { css } from "styled-components";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 12px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;

  p {
    width: calc(100% - 24px - 8px);
    word-break: break-word;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: ${gbColor.deepGray};
  }

  &:hover {
    background-color: ${gbColor.hover};
  }
  &:active {
    background-color: ${gbColor.active};
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  width: 20px;
  margin: 0 2px;
  margin-right: 8px;

  ${(props) =>
    props.isBlur &&
    css`
      opacity: 0.6;
    `}
`;
