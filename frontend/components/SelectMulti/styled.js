import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 9px;
  border-radius: ${(props) => (props.target === "search" ? "2px" : "6px")};
  display: inline-flex;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.isLightTheme ? "#dbdbdb" : "rgba(0, 0, 0, 0.38)"};

  &:focus {
    border: 1px solid ${gbColor.systemBlue};
  }
`;

export const WrapperInput = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
`;

export const WrapperItems = styled.div`
  width: calc(100% - 24px);
  display: inline-flex;
  flex-wrap: wrap;
`;

export const Itm = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 5px;
  border-radius: 6px;
  margin: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const ItmDelete = styled.div`
  cursor: pointer;
  margin-left: 5px;
`;

export const Holder = styled.div`
  font-size: 14px;
  line-height: 24px;
  font-weight: 300;
  color: ${adminColor.fontLight};
  margin: 2px;
`;

export const WrapperChevron = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
  }

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
  width: 100%;
  max-height: 163px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.08);
  background-color: white;
  z-index: 1;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  ${(props) =>
    props.isUpward
      ? css`
          bottom: calc(100% + 1px);
          box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.08),
            0 0 4px 0 rgba(0, 0, 0, 0.01);
        `
      : css`
          top: calc(100% + 1px);
          box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.08),
            0 0 4px 0 rgba(0, 0, 0, 0.01);
        `}
`;

export const MenuItm = styled.div`
  width: 100%;
  font-size: 14px;
  padding: 10px;
  ${(props) =>
    props.isActive
      ? css`
          color: rgba(0, 0, 0, 0.2);
          cursor: inherit;
        `
      : css`
          color: ${adminColor.fontBlack};
          cursor: pointer;

          &:hover,
          &:active {
            background-color: ${adminColor.grayLight};
          }
        `};
  word-break: break-word;
  overflow-wrap: break-word;
`;
