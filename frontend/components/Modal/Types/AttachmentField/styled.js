import styled from "styled-components";
import { InputElement } from "../../../../global/styledForm";

export const Block = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const Label = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 8px;
`;

export const Name = styled.input`
  ${InputElement};
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ChkboxHint = styled.div`
  width: calc(100% - 30px - 8px);
  margin-left: 8px;
  font-size: 14px;
`;
