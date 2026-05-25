import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const WrapperBody = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: ${(props) => (props.isData ? "180px" : "30px")};
`;

export const Hint = styled.div`
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
  color: rgb(100, 100, 100);
  text-align: center;

  span {
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    color: ${gbColor.purple};
    text-decoration: underline;
  }
`;
