import styled, { css } from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin: 0 10px;

  @media (max-width: 767px) {
    margin: 0 5px;
  }
`;

export const WrapperIcon = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isHighlight }) =>
    isHighlight &&
    css`
      padding: 4px;
      border: 1.5px solid ${gbColor.highlight_green};
      border-radius: 4px;
      background-color: ${gbColor.highlight_yellow};
    `}
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 1px);
  right: 0;
  border-radius: 3px;
  background-color: white;
  width: 200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
`;

export const Item = styled.div`
  position: relative;
  width: 100%;
  padding: 12px 15px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${gbColor.lightGray};
  }

  p {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.59);
  }

  &:first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  &:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;
