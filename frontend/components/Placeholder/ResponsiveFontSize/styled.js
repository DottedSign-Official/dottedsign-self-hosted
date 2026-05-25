import styled from "styled-components";

export const SVG = styled.svg`
  max-width: ${(props) => props.maxWidth};
  max-height: 80%;
  width: fit-content;
`;

export const Text = styled.text`
  font-weight: 400;
  font-family: "Droid Sans";
  fill: ${(props) => props.color};
`;
