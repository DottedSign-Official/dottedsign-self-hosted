import styled from "styled-components";
import { gbColor, orderColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background-color: ${(props) =>
    props.indx !== undefined ? orderColor[props.indx] : gbColor.black12};
`;
