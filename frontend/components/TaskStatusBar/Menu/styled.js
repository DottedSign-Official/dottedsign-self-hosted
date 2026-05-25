import styled, { css } from "styled-components";
import { gbColor, myStatusColor } from "../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: white;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const Item = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 5px 14px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? gbColor.purple : "rgb(0, 0, 0, 0.56)")};
  font-weight: 700;

  &:nth-child(1) {
    color: ${(props) =>
      props.isActive ? myStatusColor.waiting_for_me : "rgb(0, 0, 0, 0.56)"};
  }
  &:nth-child(2) {
    color: ${(props) =>
      props.isActive ? myStatusColor.waiting_for_others : "rgb(0, 0, 0, 0.56)"};
  }
  &:nth-child(3) {
    color: ${(props) =>
      props.isActive ? myStatusColor.completed : "rgb(0, 0, 0, 0.56)"};
  }
  &:nth-child(4) {
    color: ${(props) =>
      props.isActive ? myStatusColor.draft : "rgb(0, 0, 0, 0.56)"};
  }

  @media (min-width: 768px) {
    &:not(:last-child) {
      margin-right: 30px;
    }

    ${(props) =>
      props.isActive &&
      css`
        &:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 4px;
          bottom: 0;
          left: 0;
          background-color: ${gbColor.purple};
          z-index: 2;
        }
      `}
  }

  @media (max-width: 767px) {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    padding: 21px 0;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    &:nth-child(1) {
      color: ${myStatusColor.waiting_for_me};
    }
    &:nth-child(2) {
      color: ${myStatusColor.waiting_for_others};
    }
    &:nth-child(3) {
      color: ${myStatusColor.completed};
    }
    &:nth-child(4) {
      color: ${myStatusColor.draft};
    }
  }
`;

export const Count = styled.div`
  display: inline-flex;
  font-size: 20px;
  font-weight: 700;
  padding: 5px;
  order: 1;

  @media (max-width: 767px) {
    font-size: 14px;
    order: 2;
  }

  span {
    display: none;

    @media (max-width: 767px) {
      display: inline-flex;
    }
  }
`;

export const Tag = styled.div`
  display: inline-flex;
  width: 100%;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  order: 2;

  @media (max-width: 767px) {
    width: auto;
    font-size: 16px;
    order: 1;
  }
`;
