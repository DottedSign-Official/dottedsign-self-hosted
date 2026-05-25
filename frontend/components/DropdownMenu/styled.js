import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const FloatMenuWrapper = styled.span`
  position: relative;
  overflow: visible;
`;

export const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  background-color: transparent;

  &:hover {
    background-color: ${gbColor.hover};
  }
`;

export const FloatMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  min-width: 100px;
  background-color: white;
  display: ${(props) => (props.isVisible ? "inline-flex" : "none")};
  grid-template-columns: 1fr;
  gap: 6px;
  padding: 6px;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  white-space: nowrap;
  flex-direction: column;
  ${(props) =>
    props.isAlignRight
      ? css`
          right: -10px;
        `
      : css`
          left: -10px;
        `};
`;

export const FloatMenuItem = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr;
  grid-template-rows: 24px;
  grid-template-areas: "menuItemIcon menuItemText";
  gap: 6px;
  width: ${(props) => (props.width ? props.width : "100%")};
  align-items: center;
  overflow: hidden;
  cursor: pointer;

  & > :first-child {
    grid-area: menuItemIcon;
    width: 24px;
    height: 24px;
    margin: 0 auto;
  }

  & > :last-child {
    grid-area: menuItemText;
    text-align: left;
  }
`;
