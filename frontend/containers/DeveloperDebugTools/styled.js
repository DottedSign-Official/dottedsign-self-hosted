import styled from "styled-components";
import { color, gbColor } from "../../global/styled";

export const BlockContent = styled.div`
  width: 100%;
  padding: 10px 0px;
`;

export const Tabs = styled.div`
  display: flex;
  padding: 10px 0;

  border-bottom: 1px solid ${color.black20};
`;
export const Tab = styled.div`
  font-size: 20px;
  color: ${(props) => (props.isActive ? gbColor.purple : color.black40)};
  padding: 0 8px;
  cursor: pointer;
`;
