import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Recipients = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: solid 1px ${gbColor.black12};
`;

export const Recipient = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 15px;

  &:not(:last-child) {
    border-bottom: solid 1px ${gbColor.black12};
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

export const Name = styled.div`
  width: calc(100% - 18px);
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
