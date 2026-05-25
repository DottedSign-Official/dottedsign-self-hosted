import styled, { css } from "styled-components";
import { gbColor } from "../../../global/styled";

export const Thumb = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const ThumbOrder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: ${(props) =>
    props.isFocus ? gbColor.systemBlue : "rgb(150, 150, 150)"};
  color: white;
  font-size: 10px;
  border-radius: 100%;
`;

export const Thumbnail = styled.img`
  width: 100%;
  ${(props) =>
    props.isFocus
      ? css`
          box-shadow: 0 0 0 2px ${gbColor.systemBlue};
        `
      : css`
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.38);
        `};
`;

export const WrapperInvolvers = styled.div`
  position: absolute;
  bottom: 8px;
  left: 0;
  display: flex;
  align-items: center;
  max-width: 100%;
`;

export const More = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.12), 0 0 8px 0 rgba(0, 0, 0, 0.06);
  border-radius: 100%;
  background-color: white;
  margin-left: -5px;
  cursor: default;
  font-size: 12px;
  font-weight: 400;
`;
