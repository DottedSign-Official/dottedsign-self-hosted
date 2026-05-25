import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const WrapperLabels = styled.div`
  position: relative;
  max-width: calc(100% - 80px);
  margin-right: 50px;
  height: 46px;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: hidden;
`;

export const Label = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
  height: 26px;
  align-items: center;
  padding: 0 15px;
  border-radius: 15px;
  font-size: 12px;
  margin: 8px 8px 8px 0;
  cursor: pointer;
  transition: all 0.3s;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ${(props) => {
    if (props.isPlaceholder) {
      return css`
        border: 1px dashed black;
        color: black;
        font-weight: 400;
      `;
    }

    if (props.isFocus) {
      return css`
        border: 1px solid black;
        background-color: white;
        color: black;
        font-weight: 500;
      `;
    }

    return css`
      border: 1px solid rgba(0, 0, 0, 0.2);
      color: black;
      font-weight: 400;

      &:hover {
        border-color: rgba(0, 0, 0, 0.8);
      }
    `;
  }};
`;

export const WrapperButton = styled.div`
  display: inline-flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 100%;
  cursor: pointer;
  background-color: white;

  &:focus,
  &:active,
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  ${(props) =>
    props.isExpand &&
    css`
      transform: rotate(180deg);
    `};
`;

export const WrapperMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 100%;
  z-index: 999;
`;
