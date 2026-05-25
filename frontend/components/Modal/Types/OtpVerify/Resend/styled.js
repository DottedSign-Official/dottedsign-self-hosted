import styled from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.38);

  @media (max-width: 767px) {
    margin-bottom: 20px;
    font-size: 12px;
  }
`;

export const Counter = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${gbColor.purple};
  margin-left: 10px;
`;

export const Btn = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${gbColor.purple};
  cursor: pointer;
  text-decoration: underline;
`;
