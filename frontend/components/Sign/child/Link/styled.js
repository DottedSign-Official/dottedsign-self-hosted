import styled, { css } from "styled-components";
import { gbColor } from "../../../../global/styled";
import { styleInput } from "../styled";

export const Input = styled.input`
  ${styleInput};

  ${(props) =>
    props.isLink &&
    css`
      color: ${gbColor.purple};
      text-decoration: underline;
    `};
`;
