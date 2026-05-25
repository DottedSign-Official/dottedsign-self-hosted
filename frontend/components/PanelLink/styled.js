import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const WrapperInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 150px;
`;

export const Warn = styled.p`
  width: 100%;
  font-weight: 500;
  padding: 8px;
  color: ${gbColor.warn};
`;
