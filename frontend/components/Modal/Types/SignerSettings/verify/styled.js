import styled from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => (props.warning ? gbColor.errorMsg : gbColor.black87)};
  line-height: calc(25 / 14);
  padding: 0 5px 3px;
`;

export const Link = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${gbColor.purple};
  padding: 0 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  cursor: pointer;
`;
