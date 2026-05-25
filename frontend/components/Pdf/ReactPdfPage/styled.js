import styled from "styled-components";

export const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Image = styled.img`
  background: white;
  position: absolute;
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.width ? props.height : "100%")};
  top: 0;
  left: 0;
`;
