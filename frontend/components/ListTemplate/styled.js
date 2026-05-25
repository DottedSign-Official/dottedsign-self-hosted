import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

const ItemStyle = css`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 180px;
  margin: 30px 16px;
  border-radius: 6px;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  width: calc(100% + 16px * 2);
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin: 0 -16px;
  min-height: 230px;
  justify-content: flex-start;
  align-items: flex-start;

  @media (max-width: 400px) {
    justify-content: center;
  }
`;

export const WrapperCreate = styled.div`
  ${ItemStyle};
  height: 230px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

export const Text = styled.a`
  font-size: 16px;
  color: ${gbColor.purple};
  font-weight: 500;
  cursor: pointer;
`;

export const WrapperItem = styled.div`
  ${ItemStyle};

  ${(props) =>
    props.isFocus &&
    css`
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 230px;
        background-color: ${gbColor.systemBlue};
        border-radius: 6px;
        opacity: 0.2;
        z-index: 2;
      }
    `};
`;

export const Preview = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 230px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 6px;
  }

  div {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-color: black;
  }
`;

export const Name = styled.div`
  position: relative;
  width: 100%;
  padding: 8px 15px;
  z-index: 4;
`;

export const TemplateCode = styled.p`
  color: #797979;
  text-overflow: ellipsis;
  width: inherit;
  overflow: hidden;
  padding: 0 15px;
  text-align: center;
`;

export const ShareIcon = styled.div`
  position: absolute;
  top: calc(230px - 5px - 24px);
  right: 5px;
  box-shadow: inset 0 0 0 1px white;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: enter;

  ${(props) =>
    props.isShared
      ? css`
          background-color: ${gbColor.purple};
          border: 1px solid ${gbColor.purple};
        `
      : css`
          background-color: rgb(100, 100, 100);
          border: 1px solid rgb(100, 100, 100);
        `};

  svg {
    filter: brightness(0) invert(1);
    opacity: 1;

    * {
      fill-opacity: 1;
    }
  }
`;
