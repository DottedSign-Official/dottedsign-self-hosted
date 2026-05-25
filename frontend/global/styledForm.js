import styled, { css } from "styled-components";
import { gbColor } from "./styled";
import { btnCommon, theme } from "./styledBtn";

export const Form = styled.form`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
`;

export const WrapperEle = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.38);
  margin-bottom: 8px;
`;

export const InputElement = css`
  width: 100%;
  padding: 10px 16px;
  font: inherit;
  font-size: 16px;
  font-weight: 400;
  color: black;
  border-radius: 4px;
  border: solid 1px #979797;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    border: 1px solid ${gbColor.systemBlue};
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
    font-weight: 300;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 767px) {
    padding: 8px 5px;
  }
`;

const readOnlyStyle = css`
  color: rgba(0, 0, 0, 0.56);
  background-color: #ececec;
  border-color: ${gbColor.disabled};
`;

export const Input = styled.input`
  ${InputElement};
  width: ${(props) => (props.width ? props.width : "100%")};

  &:read-only {
    ${readOnlyStyle}
  }
`;

export const RequestInput = styled.input`
  ${InputElement};

  &::placeholder {
    color: #999999;
    font-weight: 300;
  }
`;

export const Textarea = styled.textarea`
  ${InputElement};

  &:read-only {
    background-color: rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.38);
  }
`;

export const FormPanel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`;

export const FormButton = styled.button`
  ${btnCommon};
  ${theme.primaryFlex};
`;

export const WrapperError = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
`;

export const Error = styled.div`
  font-size: 12px;
  color: ${gbColor.warn};
  font-weight: 500;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const WarningTextBtn = styled.div`
  ${btnCommon}
  ${theme.textMini}
  color: ${gbColor.warn};
`;

export const DeleteButton = styled.button`
  ${btnCommon}
  ${theme.textMini}
  color: ${gbColor.warn};
  &:hover {
    text-decoration: underline;
  }
`;

export const CheckButton = styled.button`
  ${btnCommon}
  ${theme.textMini}
  color: ${gbColor.primary};
  &:hover {
    text-decoration: underline;
  }
`;
