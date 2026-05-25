import styled, { css, keyframes } from "styled-components";

const slidein = keyframes`
  from { left: -300px; }
  to { left: 0; }
`;

const slideout = keyframes`
  from { left: 0; }
  to { left: -300px; }
`;

export const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`;

export const Back = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.56);
`;

export const Content = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 64px 24px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12);
  z-index: 98;

  ${(props) =>
    props.isVisible
      ? css`
          animation: ${slidein} 0.4s forwards;
          -webkit-animation: ${slidein} 0.4s forwards;
        `
      : css`
          animation: ${slideout} 0.4s forwards;
          -webkit-animation: ${slideout} 0.4s forwards;
        `};
`;

export const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export const WrapperAvatar = styled.div`
  display: flex;
  width: 100%;
  margin-left: -8px;
  align-items: center;
`;

export const Info = styled.div`
  width: calc(100% - 56px - 8px);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  margin-left: 8px;

  b,
  p {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    font-size: 8px;
    color: rgba(0, 0, 0, 0.38);
  }
`;

export const WrapperBtn = styled.div`
  display: flex;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.56);
  }
`;
