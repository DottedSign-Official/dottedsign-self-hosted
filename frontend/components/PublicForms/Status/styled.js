import styled from "styled-components";
import { gbColor } from "../../../global/styled";

export const WrapperMore = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
`;

export const More = styled.div`
  position: relative;
  cursor: pointer;
`;

export const WrapperMenu = styled.div`
  position: absolute;
  right: 10px;
  top: 25px;
  min-width: 150px;
`;

export const Menu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 2;
  box-shadow: 1px 1px 10px ${gbColor.black12};
  border-radius: 6px;
`;

export const Item = styled.div`
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 11px;

  &:hover {
    background-color: ${gbColor.black12};
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;
