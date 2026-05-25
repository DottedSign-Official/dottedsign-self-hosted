import styled from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 34px;
`;

export const TextWrp = styled.div`
  color: ${(props) => (props.showEditBtn ? gbColor.black87 : gbColor.hintGray)};
`;

export const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  ${(props) => props.warning && `color: ${gbColor.errorMsg}`};
  line-height: calc(25 / 14);
  padding: 0 5px 3px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 5px;
  margin-bottom: 30px;
`;

export const Label = styled.div`
  width: 100%;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${gbColor.deepGray};
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;

export const WrapperBtn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 5px 5px;
`;

export const Btn = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.purple};
  cursor: pointer;
`;
