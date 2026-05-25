import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
`;

export const WrapperIconShadow = styled.div`
  border-radius: 100%;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12);
`;

export const WrapperIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${gbColor.purple};
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 100%;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  ${(props) =>
    !props.isCollapse &&
    css`
      transform: rotate(-45deg);
    `};
`;

export const WrapperMenu = styled.div`
  width: 320px;
  position: absolute;
  top: calc(100% + 20px);
  right: 5px;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  z-index: 10;

  &:before {
    content: "▲";
    position: absolute;
    top: -12.1px;
    right: 13px;

    font-size: 15px;
    line-height: 1;
    color: white;
    text-shadow: 1px -1px 1px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 767px) {
    top: auto;
    bottom: calc(100% + 20px);

    &:before {
      content: "▼";
      top: auto;
      bottom: -12.1px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12);
    }
  }

  @media (max-width: 375px) {
    width: 280px;
  }
`;

export const WrapperItem = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 375px) {
    padding: 15px;
  }
`;

export const ItemIcon = styled.div`
  display: inline-flex;
  margin-right: 24px;
  width: 65px;
  height: 65px;

  svg {
    width: 65px !important;
    height: 65px !important;
  }

  @media (max-width: 375px) {
    width: 48px;
    height: 48px;
    margin-right: 10px;

    svg {
      width: 48px !important;
      height: 48px !important;
    }
  }
`;

export const Text = styled.div`
  width: calc(100% - 65px - 24px);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 375px) {
    width: calc(100% - 48px - 10px);
  }

  b {
    font-size: 16px;
    color: black;
    margin-bottom: 8px;

    @media (max-width: 375px) {
      font-size: 14px;
      margin-bottom: 3px;
    }
  }

  p {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.38);

    @media (max-width: 375px) {
      font-size: 10px;
    }
  }
`;
