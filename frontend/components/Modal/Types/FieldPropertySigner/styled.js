import styled from "styled-components";

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
  padding: 8px;
`;

export const ChkboxHint = styled.div`
  width: calc(100% - 30px - 8px);
  margin-left: 8px;
  font-size: 14px;
`;

export const Break = styled.div`
  width: 100%;
  height: 5px;
`;
