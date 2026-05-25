import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 200px;
`;

const styleMenuItem = css`
  position: relative;
  width: 100%;
  padding: 10px 24px;
  background-color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const MenuItemDefault = styled.div`
  ${styleMenuItem};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
`;

export const WrapperIcon = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  right: 10px;
  display: flex;
  align-items: center;
  z-index: 2;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  ${(props) =>
    !props.isCollapse &&
    css`
      -moz-transform: rotate(-180deg);
      -webkit-transform: rotate(-180deg);
      -o-transform: rotate(-180deg);
      -ms-transform: rotate(-180deg);
      transform: rotate(-180deg);
    `};
`;

export const Menu = styled.div`
  position: absolute;
  left: 0;
  top: calc(100% + 1px);
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  z-index: 2;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
`;

export const MenuItem = styled.div`
  ${styleMenuItem};
  ${(props) =>
    props.isActive
      ? css`
          background-color: rgba(0, 0, 0, 0.1);
        `
      : css`
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        `};

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
`;
