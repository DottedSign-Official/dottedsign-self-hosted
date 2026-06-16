import styled from "styled-components";
import { color } from "../../../../global/styled";

export const CtaImage = styled.img`
  width: auto;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 4px;
`;

export const Text = styled.div`
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: black;
  text-align: left;

  ul,
  ol {
    padding-left: 24px;
  }

  a {
    color: ${color.hyperlink};
    font-weight: normal;
    &:hover {
      text-decoration: underline;
    }
  }
`;
