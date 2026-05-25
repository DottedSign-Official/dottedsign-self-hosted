import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1px;
`;

export const WrapperHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 100%;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;

  ${(props) =>
    props.isContent &&
    css`
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    `};

  &:focus,
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const WrapperTitle = styled.div`
  display: inline-flex;
  align-items: center;
  width: calc(100% - 26px);
  font-size: 14px;
  color: black;
  font-weight: 500;
`;

export const WrapperContent = styled.div`
  width: 100%;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  transform-origin: 0 0;

  ${(props) =>
    props.isContent
      ? css`
          padding: 15px;
          opacity: 1;
        `
      : css`
          height: 0;
          padding: 0 15px;
          opacity: 0;
          -ms-transform: rotateX(90deg);
          transform: rotateX(90deg);
        `};
`;
