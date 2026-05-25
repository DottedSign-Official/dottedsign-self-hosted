import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

const borderRadius = "4px";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  cursor: pointer;
  height: 100%;
`;

export const ItemActive = styled.div`
  padding: 10px 16px;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: ${(props) => (props.isFlat ? "0" : borderRadius)};

  ${(props) =>
    props.isReadonly
      ? css`
          background-color: rgba(0, 0, 0, 0.05);
        `
      : props.isFocus
      ? css`
          border: 1px solid ${gbColor.systemBlue};
        `
      : css`
          border: 1px solid rgba(0, 0, 0, 0.38);
        `};
`;

export const Text = styled.p`
  width: calc(100% - 24px - 10px);
  font-size: 14px;
  font-weight: 400;
  color: black;
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  margin-left: 10px;
  transition-duration: 0.3s;
  transition-property: transform;

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
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: ${borderRadius};
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 2;
`;

export const MenuItem = styled.div`
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 400;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: ${gbColor.hover};
  }

  &:first-child {
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
  }
  &:last-child {
    border-bottom-left-radius: ${borderRadius};
    border-bottom-right-radius: ${borderRadius};
  }

  ${(props) => {
    if (props.isLabel) {
      return css`
        color: ${gbColor.gray};
        cursor: default;

        &:hover {
          background-color: white;
        }
      `;
    }

    if (props.isActive) {
      return css`
        background-color: ${gbColor.active};
      `;
    }
  }}
`;
