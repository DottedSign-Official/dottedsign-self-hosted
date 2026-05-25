import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { btnCommon, theme } from "../../global/styledBtn";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;

  background-color: ${(props) =>
    props.isBack ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0)"};

  ${(props) =>
    props.isPadding
      ? css`
          width: 100%;
          height: 100%;
        `
      : css`
          width: auto;
          height: auto;
        `};
`;

export const PlaceHolder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.isPadding ? "80px 0" : "0")};
`;

export const Button = styled.div`
  ${btnCommon};
  ${theme.upload};
`;

export const Text = styled.div`
  display: inline-flex;
  font-size: 16px;
  font-weight: 500;
  color: ${gbColor.purple};
  cursor: pointer;
`;

export const Hint = styled.p`
  width: 100%;
  text-align: center;
  white-space: prewrap;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.56);
  line-height: 1.5;
`;
