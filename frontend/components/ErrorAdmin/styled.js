import styled from "styled-components";
import { theme } from "../../global/styledBtn";
import { adminColor, adminFontSize } from "../../global/styledAdmin";

export const WrapperPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${adminFontSize};
  color: ${adminColor.fontLight};
  padding: 25px;
`;

export const Icon = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${adminColor.fontBlack};
  margin-bottom: 10px;
`;

export const Desc = styled.div`
  ${adminFontSize};
  color: ${adminColor.fontLight};
  margin-bottom: 20px;
`;

export const Btn = styled.a`
  text-decoration: none;
  ${theme.primaryFlex};
`;

export const Wrapper = styled.div`
  ${adminFontSize};
  color: ${adminColor.fontLight};
`;
