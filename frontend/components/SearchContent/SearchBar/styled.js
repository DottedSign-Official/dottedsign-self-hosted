import styled from "styled-components";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
`;

export const WrapperInner = styled.div`
  width: 900px;
  padding: 12px 35px;
  padding-top: 25px;
`;

export const WrapperSearch = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const Btn = styled.div`
  width: 100px;
  height: 50px;
  background-color: ${gbColor.purple};
  color: white;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  margin-left: -1px;

  @media (max-width: 767px) {
    height: 46px;
  }
`;
