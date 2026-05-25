import styled from "styled-components";
import { InputElement } from "../../global/styledForm";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const Default = styled.div`
  ${InputElement};
  border: 1px solid rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;

  p {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
    font-weight: 700;
    font-size: 18px;
    color: black;
  }
`;
