import styled from "styled-components";
import { styleInput } from "../../styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const Input = styled.input`
  ${styleInput};

  &::placeholder {
    font-size: ${(props) => props.fontSize};
  }
`;
