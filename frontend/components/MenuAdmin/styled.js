import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;
  width: 20%;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

export const Label = styled.p`
  position: relative;
  width: 100%;
  padding: 12px 25px;
  font-size: 16px;
  cursor: default;
  text-align: left;
`;

export const Item = styled.div`
  position: relative;
  width: 100%;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  &:active,
  &:focus {
    background-color: rgba(0, 0, 0, 0.05);
  }

  ${(props) =>
    props.isActive
      ? css`
          color: ${adminColor.fontBlack};
          font-weight: 500;

          &:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            background-color: ${gbColor.purple};
          }
        `
      : css`
          color: ${adminColor.fontLight};
          font-weight: 300;
        `};

  ${(props) =>
    props.isChild &&
    css`
      padding: 12px 35px;
    `};
`;
