import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

const styleCol = css`
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const OrderNumLinkBar = styled.div`
  position: absolute;
  bottom: calc(50% + 17px);
  left: calc(25px - 3px);
  width: 6px;
  height: calc(100% + 16px - 34px);
  border-radius: 2px;
  background-color: ${gbColor.purple};
  z-index: 2;
`;

export const ColTag = styled.div`
  ${styleCol};
  width: 50px;
  height: 50px;
`;

export const ColName = styled.div`
  ${styleCol};
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 500;
  margin: 0 25px;

  ${(props) =>
    props.isMore
      ? css`
          width: calc(100% - 50px - 50px - 48px);
        `
      : css`
          width: calc(100% - 50px - 50px);
        `};
`;

export const ColMore = styled.div`
  ${styleCol};
  width: 48px;
`;
