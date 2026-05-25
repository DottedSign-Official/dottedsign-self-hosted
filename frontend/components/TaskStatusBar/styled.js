import styled, { css } from "styled-components";
import { myStatusColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
`;

export const ItemActive = styled.div`
  width: 100%;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.div`
  margin-left: calc(8px + 24px);
  margin-right: 8px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 700;

  ${(props) =>
    props.colorTag &&
    css`
      color: ${myStatusColor[props.colorTag]};
    `};
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  align-items: center;
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

export const WrapperMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: calc(50% - 144px);
  width: 288px;
  background-color: white;
  padding: 8px;
  z-index: 4;

  @media (max-width: 767px) {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  }
`;
