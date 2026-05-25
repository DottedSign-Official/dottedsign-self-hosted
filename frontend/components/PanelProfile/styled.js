import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const WrapperItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const DefaultSelection = styled.div`
  max-width: 100%;
  padding: 30px 0;
  font-size: 14px;
  font-weight: 400;
  color: rgb(100, 100, 100);
  text-align: left;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  margin: 8px 0;
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  cursor: pointer;
  word-wrap: break-word;

  ${(props) =>
    props.isFocus
      ? css`
          border-color: ${gbColor.systemBlue};
          background-color: ${gbColor.activeBack};
        `
      : css`
          border-color: rgba(0, 0, 0, 0.38);
        `};

  span {
    display: inline-block;
    max-width: 100%;
    font-size: 16px;
    font-weight: 500;
    color: black;
  }
`;
