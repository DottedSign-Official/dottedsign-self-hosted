import styled from "styled-components";
import { btnCommon, theme } from "../../../global/styledBtn";

export const BtnPositive = styled.a`
  ${btnCommon};
  ${theme.adminPositive};
  text-decoration: none;
`;

export const BtnNegative = styled.a`
  ${btnCommon};
  ${theme.adminNegative};
  text-decoration: none;
`;

export const DividerBtn = styled.div`
  display: inline-flex;
  width: 16px;
  height: 10px;

  @media (max-width: 480px) {
    width: 10px;
  }
`;
