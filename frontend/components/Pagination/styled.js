import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

const styleEle = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

export const TagNav = styled.div`
  ${styleEle};
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  border-style: solid;
  border-width: 1px;
  border-color: ${gbColor.purple};
`;

export const Tag = styled.div`
  ${styleEle};
  font-size: 14px;
  font-weight: 700;

  ${(props) =>
    props.isActive
      ? css`
          color: white;
          background-color: ${gbColor.purple};
        `
      : css`
          color: ${gbColor.purple};
        `};
`;

export const Dot = styled.div`
  ${styleEle};
  cursor: default;
`;
