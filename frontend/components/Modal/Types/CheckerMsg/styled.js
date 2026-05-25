import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.gray};
  margin-bottom: 10px;
`;

export const Message = styled.textarea`
  width: 100%;
  background-color: rgba(88, 106, 242, 0.1);
  border-radius: 6px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  resize: none;
  cursor: default;
  border-color: transparent;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
`;
