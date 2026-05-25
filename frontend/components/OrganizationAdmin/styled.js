import styled from "styled-components";
import { ItemContent } from "../../global/styledAdmin";

export const CompanyAvatar = styled.img`
  width: 100px;
`;

export const AdminList = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
`;

export const AdminInfo = styled(ItemContent)`
  max-width: 100%;
`;
