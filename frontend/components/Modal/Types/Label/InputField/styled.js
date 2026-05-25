import styled, { css } from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  width: 100%;
`;
export const Input = styled.input`
  padding: 10px 8px;
  font-weight: 300;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  &[type="text"],
  &[type="password"] {
    font-size: 16px;
    font-weight: 300;
  }
`;
export const Hint = styled.span`
  font-size: 12px;
  margin-top: 5px;
  color: rgba(0, 0, 0, 0.8);
  padding: 0 5px;
  ${({ isActive }) =>
    isActive &&
    css`
      color: ${gbColor.purple};
      cursor: pointer;
      font-size: 14px;
    `}
  ${({ isError }) =>
    isError &&
    css`
      color: ${gbColor.errorMsg};
      font-size: 14px;
    `}
`;
