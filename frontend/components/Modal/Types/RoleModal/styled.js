import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Hint = styled.p`
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
  color: black;
  text-align: left;
`;

export const Main = styled.div`
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
`;

export const Warn = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.warn};
  padding: 8px;
`;
