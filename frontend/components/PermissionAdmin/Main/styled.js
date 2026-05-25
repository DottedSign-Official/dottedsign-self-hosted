import styled from "styled-components";
import { adminColor, adminFontSize } from "../../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.div`
  width: 100%;
  background-color: ${adminColor.grayLight};
  color: ${adminColor.fontBlack};
  font-size: ${adminFontSize};
  font-weight: 500;
  padding: 12px;
`;

export const SectionContent = styled.div`
  width: 100%;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  border-bottom: 1px solid ${adminColor.grayLight};
  padding: 5px 10px;
`;

export const Col = styled.div`
  width: ${(props) => (props.isLabel ? "calc(100% - 40px)" : "40px")};
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 8px;
`;
