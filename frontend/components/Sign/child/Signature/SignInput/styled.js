import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const SignatureBlock = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("${(props) => props.src}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
