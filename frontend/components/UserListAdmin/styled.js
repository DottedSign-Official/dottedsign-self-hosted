import styled, { css } from "styled-components";
import { adminColor, adminFontSize } from "../../global/styledAdmin";
import { gbColor } from "../../global/styled";

export const BtnPositive = styled.div`
  color: ${gbColor.warn};
  font-size: 12px;

  cursor: pointer;
`;

export const WrapperList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${adminColor.grayLight};
  border-radius: 6px;
  margin-top: 20px;
`;

export const ListTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${adminColor.grayLight};
`;

export const ListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:nth-child(2n + 1) {
    background-color: ${adminColor.grayLight};
  }
`;

export const Col = styled.div`
  display: inline-flex;
  width: ${(props) => props.len};
  ${adminFontSize};
  color: ${adminColor.fontBlack};
  padding: 20px 10px;
  ${(props) =>
    props.isTitle
      ? css`
          font-weight: 500;
          cursor: pointer;
        `
      : css`
          font-weight: 300;
        `};
`;

export const Text = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) =>
    props.isBold &&
    css`
      font-weight: 700;
    `}
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  align-items: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  ${(props) =>
    props.isAsc &&
    css`
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    `};
`;
