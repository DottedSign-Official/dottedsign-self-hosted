import styled from "styled-components";
import { gbColor } from "../../../global/styled";

export const WrapperMore = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 4;
  cursor: pointer;
`;

export const WrapperIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12);
`;

export const MenuItem = styled.div`
  width: 100%;
  padding: 8px 15px;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  p {
    width: calc(100% - 24px - 8px);
    margin-left: 8px;
    overflow-wrap: break-word;
  }

  p {
    width: calc(100% - 24px - 8px);
    word-break: break-word;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: ${gbColor.deepGray};
  }
`;
