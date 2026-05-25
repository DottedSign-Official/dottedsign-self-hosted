import styled, { css } from "styled-components";
import { gbColor } from "../../../../global/styled";

export const WrapperLang = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 50px 20px;
`;

export const WrapperItem = styled.div`
  display: inline-flex;
  width: 25%;
  padding: 10px;
`;

export const Item = styled.div`
  display: inline-flex;
  width: 100%;
  height: 80px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;

  ${(props) =>
    props.isActive
      ? css`
          border: 1px solid black;
        `
      : css`
          &:hover {
            background-color: ${gbColor.hover};
          }
        `};
`;
