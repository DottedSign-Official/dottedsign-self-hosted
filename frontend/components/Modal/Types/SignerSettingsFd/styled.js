import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Block = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  &:last-child {
    margin-bottom: 150px;
  }
`;

export const Label = styled.h3`
  width: 100%;
  font-size: 14px;
  color: ${gbColor.black87};
  margin: 0 0 8px;
`;

export const Hint = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;

  svg {
    margin-right: 8px;
  }

  p {
    font-size: 12px;
    color: ${gbColor.black87};
  }
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 10px;

  p {
    width: calc(100% - 24px - 15px);
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
  }
`;
