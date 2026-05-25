import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { adminColor } from "../../global/styledAdmin";

export const WrapperMenu = styled.div`
  position: relative;
  width: 106px;
  height: 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;

  &:focus {
    border: 1px solid ${gbColor.systemBlue};
  }
`;

export const Active = styled.div`
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  padding: 11px;
  color: ${adminColor.fontBlack};
`;

export const WrapperIcon = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  right: 2px;
  transition: transform 0.3s;

  ${(props) =>
    !props.isCollapse &&
    css`
      -ms-transform: rotateX(180deg);
      transform: rotateX(180deg);
    `};
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 100%;
  min-width: 230px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 3px 3px ${adminColor.grayLight};
  z-index: 2;
`;

export const MenuOption = styled.div`
  position: relative;
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  padding: 11px;
  cursor: pointer;
  color: ${(props) =>
    props.isActive ? adminColor.fontBlack : adminColor.fontLight};

  &:hover {
    background-color: ${adminColor.grayLight};
  }
`;

export const Switch = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: -20px;

  span {
    color: ${gbColor.purple};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
`;
