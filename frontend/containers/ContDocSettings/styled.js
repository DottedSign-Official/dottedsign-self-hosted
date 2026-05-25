import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const TipWrapper = styled.div`
  position: relative;
  top: -4px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: ${gbColor.hintGray};
  margin-bottom: 16px;
`;

export const TipText = styled.p`
  margin-left: 8px;
`;

export const FormDescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormDesc = styled.textarea`
  width: 100%;
  height: 200px;
  resize: none;
  font-size: 16px;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #cbcbcb;
  border-radius: 4px;
  outline: none;
  color: #000000;
  font-weight: 400;
`;

export const FormDescCounter = styled.div`
  align-self: flex-end;
  font-size: 12px;
  color: ${gbColor.hintGray};
`;
