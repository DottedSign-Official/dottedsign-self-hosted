import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Block = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 25px;
  }
`;

export const Label = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px;
`;

export const ChkboxHint = styled.div`
  width: calc(100% - 30px - 8px);
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
`;

export const Hint = styled.div`
  font-size: 12px;
  color: gray;
  white-space: "pre-line";
  margin-bottom: 8px;
`;

export const ErrorHint = styled.p`
  display: block;
  color: #f00;
  visibility: ${({ isError }) => (isError ? "visible" : "hidden")};
`;

export const Break = styled.div`
  width: 100%;
  height: 5px;
`;

export const Error = styled.p`
  width: 100%;
  font-size: 12px;
  color: ${gbColor.warn};
  margin: 5px 0;
`;
