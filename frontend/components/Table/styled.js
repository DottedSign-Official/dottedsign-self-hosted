import styled, { css } from "styled-components";
import { color, gbColor } from "../../global/styled";
import { adminColor } from "../../global/styledAdmin";

export const BlockContent = styled.div`
  font-size: 16px;
  padding: 10px;
  color: ${color.black80};
  display: flex;
  align-items: center;

  &:nth-child(2n) {
    background-color: ${gbColor.bgGray};
  }

  &:nth-child(2n + 1) {
    background-color: white;
  }

  border: 1px solid ${adminColor.grayLight};

  :first-child {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  ${(props) =>
    props.isClickable &&
    css`
      :not(:first-child):hover {
        border: 1px solid black;
        cursor: pointer;
      }
    `}
`;

export const Value = styled.div`
  width: ${(props) => (props.width ? props.width : "50%")};
  font-size: 14px;
  color: ${color.black80};
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    overflow: visible;
    white-space: normal;
    text-overflow: unset;
  }

  padding: 0 10px;
`;

export const Wrapper = styled.div`
  margin: 10px;
  position: relative;
`;
