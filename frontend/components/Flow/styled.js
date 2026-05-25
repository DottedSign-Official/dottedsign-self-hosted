import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: ${(props) => (props.isList ? "100%" : "calc(100% - 32px)")};
  margin: ${(props) => (props.isList ? "0" : "8px 16px")};
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const WrapperInner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
