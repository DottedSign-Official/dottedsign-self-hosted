import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.isDisabled &&
    css`
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.6);
        z-index: 2;
      }
    `};
`;

export const Title = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.38);
  margin-bottom: 10px;
`;

export const Item = styled.div`
  position: relative;
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 1px;
  cursor: pointer;
  border-radius: 4px;
  ${(props) =>
    props.isFocus
      ? css`
          background-color: rgba(94, 112, 241, 0.12);
        `
      : css`
          background-color: rgba(0, 0, 0, 0);
        `};

  opacity: ${(props) => (props.isViewOnly ? 0.5 : 1)};

  p {
    font-size: 16px;
    color: black;
    margin-left: 10px;
    font-weight: 500;
  }
`;
