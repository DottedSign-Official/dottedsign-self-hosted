import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const NAME_WIDTH = "190px";

export const TagCheck = styled.div`
  position: absolute;
  bottom: -4px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const styleCol = css`
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ColTagNumber = styled.div`
  ${styleCol};
  width: 60px;
  height: 28px;
`;

export const ColName = styled.div`
  ${styleCol};

  ${(props) =>
    props.isFull
      ? css`
          width: calc(100% - 50px - 16px - 72px);
        `
      : css`
          width: ${NAME_WIDTH};
          margin-right: 16px;
        `};

  ${(props) =>
    props.isModal &&
    css`
      flex: 1.1;
    `};

  @media only screen and (max-width: 800px) {
    flex: 1.1;
  }
`;

export const ColEmail = styled.div`
  ${styleCol};
  width: calc(100% - 55px - ${NAME_WIDTH} - 16px - 72px);

  ${(props) =>
    props.isModal &&
    css`
      flex: 2;
    `};

  @media only screen and (max-width: 800px) {
    flex: 2;
  }
`;

export const ColDelete = styled.div`
  ${styleCol};
  width: 32px;
  cursor: pointer;
  justify-content: flex-start;
`;

export const ColMore = styled.div`
  ${styleCol};
  cursor: pointer;
  height: auto;
  margin: 12px;
  border-radius: 50%;

  ${(props) =>
    props.isWarning &&
    `
      &::after {
        position: absolute;
        content: "\\0021";
        font-size: 14px;
        color: red;
        transform: translate(10px, 10px);
        border: 1px solid red;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        justify-content: center;
        align-items: center;
        display: flex;
      }
    `}
`;

export const ColMove = styled.div`
  ${styleCol};
  width: 24px;
  cursor: grab;
`;

export const WrapperCol = styled.div`
  position: relative;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: ${(props) => (props.align ? props.align : "center")};
  padding: 10px 10px;
`;

const TAG_WIDTH = "55px";
const TAG_ICON_WIDTH = "28px";
const BAR_WIDTH = "6px";

export const OrderNumLinkBar = styled.div`
  position: absolute;
  bottom: calc(50% + ${TAG_ICON_WIDTH} / 2 + 1px);
  left: calc(${TAG_WIDTH} / 2 - ${BAR_WIDTH} / 2 + 1px);
  width: ${BAR_WIDTH};
  height: calc(100% - ${TAG_ICON_WIDTH} / 2);
  border-radius: 2px;
  background-color: ${gbColor.purple};
  z-index: 2;
`;

export const Role = styled.p`
  width: 100%;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 500;
  color: black;
`;
