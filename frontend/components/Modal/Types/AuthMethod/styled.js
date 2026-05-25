import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const WrapperSections = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding-bottom: 50px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

export const Label = styled.div`
  width: 100%;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${gbColor.deepGray};
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;
