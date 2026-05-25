import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Item = styled.div`
  width: 100%;
  display: ${(props) => (props.$hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: flex-start;
  padding: 8px;
  border: 1px solid ${gbColor.black12};

  &:not(:last-child) {
    border-bottom: 0px solid black;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const User = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Name = styled.div`
  width: calc(100% - 18px - 12px);
  padding-left: 12px;
  font-size: 14px;
  font-weight: 700;
  color: black;
  text-align: left;
  overflow-wrap: break-word;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Permission = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 30px;
`;

export const ItemPer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const Label = styled.div`
  width: calc(100% - 30px);
  font-size: 14px;
  font-weight: 400;
  color: black;
`;
