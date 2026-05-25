import styled from "styled-components";
import { adminColor, adminFontSize } from "../../global/styledAdmin";
import { btnCommon, theme } from "../../global/styledBtn";

export const WrapperBar = styled.div`
  position: relative;
  width: 100%;
`;

export const Indicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const Indx = styled.div`
  ${adminFontSize};
  color: ${adminColor.fontLight};
`;

export const BtnDetail = styled.div`
  ${adminFontSize};
  color: ${adminColor.fontLight};
  text-decoration: underline;
  cursor: pointer;
`;

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

export const Panel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;
