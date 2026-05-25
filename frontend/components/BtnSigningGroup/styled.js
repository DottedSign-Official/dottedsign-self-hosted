import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;
  margin-left: auto;
`;

export const Btn = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
  font-weight: 500;
  color: ${gbColor.purple};
  margin-right: 8px;
  cursor: pointer;
`;

export const Tip = styled.div`
  display: inline-flex;
  align-items: center;
`;
