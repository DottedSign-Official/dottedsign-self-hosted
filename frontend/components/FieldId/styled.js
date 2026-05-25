import styled from "styled-components";

export const ErrorHint = styled.p`
  display: block;
  color: #f00;
  visibility: ${({ isError }) => (isError ? "visible" : "hidden")};
`;
