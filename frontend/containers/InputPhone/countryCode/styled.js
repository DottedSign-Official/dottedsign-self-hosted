import styled, { css } from "styled-components";
import { InputElement } from "../../../global/styledForm";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const Active = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
`;

export const ActiveItm = styled.input`
  ${InputElement};
  color: inherit;
  ${(props) =>
    props.isDisabled &&
    css`
      background-color: ${gbColor.disabled};
      border-color: ${gbColor.disabled};
    `};
`;

export const WrapperIcon = styled.div`
  position: absolute;
  top: 0;
  right: 8px;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  width: 230px;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 3px 1px ${gbColor.lightGray};
`;

export const MenuItem = styled.div`
  position: relative;
  width: 100%;
  padding: 10px 15px;
  font-size: 14px;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: ${gbColor.lightGray};
  }
`;

export const Flag = styled.p`
  margin-right: 12px;
`;

export const Name = styled.p`
  width: calc(100% - 14px - 12px);
  word-wrap: break-word;
  color: black;
  font-weight: 500;
  margin-right: 8px;

  span {
    color: ${gbColor.gray};
  }
`;
