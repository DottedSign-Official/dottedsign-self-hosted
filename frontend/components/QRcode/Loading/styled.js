import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  padding: 40px 60px;
  min-width: 580px;
  p {
    font-size: 16px;
    margin: 10px 0;
  }

  ${(props) =>
    props.isMobile &&
    css`
      min-width: 280px;
    `}
`;

export const Content = styled.div`
  font-size: 16px;
  color: black;
  padding: 40px 0 0;
  text-align: center;
`;
