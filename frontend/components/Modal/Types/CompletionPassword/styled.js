import styled from "styled-components";
import { Input } from "../../../../global/styledForm";

export const PasswordInput = styled(Input)`
  ${({ $isVisible }) =>
    $isVisible &&
    `
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
    `}
`;

export const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  input {
    padding-right: 44px;
  }
`;

export const Content = styled.div`
  width: 100%;
  min-height: min-content;
  padding: 16px 26px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 767px) {
    padding: 10px 20px;
    gap: 12px;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  > ${PasswordField} + div {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;

    > ${PasswordField} {
      flex: none;
      width: 100%;
    }

    > ${PasswordField} + div {
      flex: none;
      width: 100%;
    }
  }
`;

export const VisibilityButton = styled.button`
  position: absolute;
  top: 50%;
  right: 6px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  cursor: pointer;
`;
