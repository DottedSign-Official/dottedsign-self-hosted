import styled from "styled-components";
import { WrapperItem as GlobalWrapperItem } from "../../global/styledSettings";

export const WrapperProfile = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const WrapperItem = styled(GlobalWrapperItem)`
  align-items: center;
`;
