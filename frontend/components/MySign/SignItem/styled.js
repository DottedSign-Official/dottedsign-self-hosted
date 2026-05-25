import styled, { css } from "styled-components";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 16px;

    @media (max-width: 767px) {
      margin-bottom: 8px;
    }
  }
`;

export const Item = styled.div`
  position: relative;
  width: 100%;
  height: 49px;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  ${(props) =>
    props.isActive
      ? css`
          border: 1px solid ${gbColor.systemBlue};
          background-color: ${gbColor.activeBack};
        `
      : css`
          border: 1px solid rgb(188, 188, 188);
          background-color: rgba(0, 0, 0, 0);
        `};
`;

export const WrapperClear = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  top: -12px;
  left: -12px;
  cursor: pointer;
  z-index: 2;
  background-color: ${gbColor.purple};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.16), 0 0 8px 0 rgba(0, 0, 0, 0.08);
`;
