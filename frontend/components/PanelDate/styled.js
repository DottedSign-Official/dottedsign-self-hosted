import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const WrapperItemDate = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const ItemDate = styled.div`
  display: inline-flex;
  width: 50%;
  padding: 16px 0;
  justify-content: center;
  color: ${(props) => (props.isFocus ? gbColor.purple : "rgba(0, 0, 0, 0.56)")};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;
