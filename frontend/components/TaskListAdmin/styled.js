import styled from "styled-components";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${adminColor.grayLight};
  border-radius: 6px;
`;

export const Placeholder = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: ${adminColor.fontLight};
  padding: 20px;
`;
