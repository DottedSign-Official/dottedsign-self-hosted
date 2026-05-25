import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px;

  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.size ? props.size : "24px")};
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.src});
`;
