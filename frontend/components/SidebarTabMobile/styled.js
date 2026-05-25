import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: solid 1px rgba(151, 151, 151, 0.12);
`;

export const Active = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: black;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const IconDown = styled.div`
  display: inline-flex;
  width: 24px;
  transition-duration: 0.5s;
  transition-property: transform;
  margin-left: 10px;

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
  width: 90%;
  top: calc(100% + 7px);
  left: 5%;
  background-color: white;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 99;
`;

export const Tab = styled.div`
  position: relative;
  width: 100%;
  padding: 15px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: black;
  background-color: ${(props) => (props.isActive ? "#f4f4f4" : "white")};

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

export const WrapperIcon = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  right: 10px;
`;
