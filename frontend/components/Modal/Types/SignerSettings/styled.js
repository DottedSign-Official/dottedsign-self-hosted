import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Block = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  &:last-child {
    margin-bottom: 100px;
  }
`;

export const Label = styled.h3`
  width: 100%;
  font-size: 14px;
  color: ${gbColor.black87};
  margin: 0 0 8px;
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
    color: ${gbColor.black87};
  }
`;

export const ItemText = styled.p`
  max-width: calc(100% - 24px - 10px); // 24px is checkbox width
  margin-left: 10px;
  font-size: 14px;
  font-weight: 400;
  color: ${gbColor.black87};
`;

export const Hint = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 5px 8px;

  div {
    margin-right: 8px;
    opacity: 0.7;
  }

  p {
    width: calc(100% - 20px - 8px);
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
`;
