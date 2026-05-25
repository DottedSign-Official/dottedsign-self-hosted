import styled from "styled-components";

export const Text = styled.div`
  font-size: ${(props) => props.fontSize}px;
  font-weight: 400;
  color: ${(props) => props.color};
  white-space: ${(props) => (props.lineWrap ? "pre-wrap" : "nowrap")};
`;

export const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
`;
