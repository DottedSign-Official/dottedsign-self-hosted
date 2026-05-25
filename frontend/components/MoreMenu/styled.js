import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  box-shadow: 1px 1px 10px ${gbColor.black12};
  z-index: 10;
  width: 190px;
  border-radius: 6px;

  ${(props) =>
    props.isMenuUpward
      ? css`
          bottom: calc(100% + 16px);
        `
      : css`
          top: calc(100% + 16px);
        `};
`;
