import styled from "styled-components";

export const Wrapper = styled.div`
  display: inline-flex;
  width: ${(props) => (props.width ? props.width : "40px")};
  height: ${(props) => (props.width ? props.width : "40px")};
  border-radius: 100%;
  background-color: rgb(200, 200, 200);
  margin: 0;
`;

export const Head = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.src});
`;
