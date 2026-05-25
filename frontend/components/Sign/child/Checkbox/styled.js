import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: ${(props) => (props.isRadio ? "100%" : "3px")};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    border-radius: ${(props) => (props.isRadio ? "100%" : "1px")};
  }
`;

export const Content = styled.div`
  width: 60%;
  height: 60%;
  color: rgb(100, 100, 100);
  font-weight: 700;
  font-size: ${(props) => props.size};
  display: inline-flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.isRadio &&
    css`
      background-color: rgb(100, 100, 100);
      border-radius: 100%;
    `};

  svg {
    width: 100%;
    height: 100%;
  }
`;
