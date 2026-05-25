import styled from "styled-components";
import { gbColor } from "../../global/styled";
import { InputElement } from "../../global/styledForm";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

export const WrapperInput = styled.input`
  ${InputElement};

  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid ${gbColor.black12};
  border-radius: 6px;
  font-size: 24px;
  font-weight: 500;
  color: ${gbColor.purple};
  transition: box-shadow 0.2s ease-out;

  &:focus {
    border: 1px solid ${gbColor.black60};
  }

  @media (max-width: 767px) {
    padding: 0;
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
`;
