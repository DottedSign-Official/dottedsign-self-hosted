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
export const Outer = styled.div`
  border: 1px solid transparent;
  border-radius: 5px;
  width: ${(props) => (props.isFastSigning ? "200" : "160")}px;
  height: ${(props) => (props.isFastSigning ? "200" : "160")}px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.2);
`;

export const Content = styled.div`
  font-size: 16px;
  color: black;
  padding: 40px 0 0;
  text-align: center;
`;
