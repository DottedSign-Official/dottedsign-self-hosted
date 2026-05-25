import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;

  justify-content: ${(props) => props.alignment};
  align-items: ${(props) => props.verticalAlignment};
`;
