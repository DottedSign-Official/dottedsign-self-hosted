import styled, { css } from "styled-components";
import { gbColor } from "../../../../global/styled";
import { Input } from "../../../../global/styledForm";

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px 30px;
`;

export const Label = styled.div`
  width: 100%;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  color: black;
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;
export const Roles = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: solid 1px ${gbColor.black12};
`;

export const Role = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 15px;

  &:not(:last-child) {
    border-bottom: solid 1px ${gbColor.black12};
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const Name = styled.div`
  width: calc(100% - 18px - 10px);
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
`;

export const Items = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

export const WrapperLabel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ChkboxLabel = styled.div`
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: 60%;
  overflow-wrap: break-word;
  font-size: 14px;
  color: black;
  font-weight: 400;
  padding-right: 8px;

  span {
    margin-left: 8px;
  }
`;

export const WrapperInput = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0 0;
`;

export const Link = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${gbColor.purple};
  margin-bottom: 20px;
  cursor: pointer;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export const CheckboxText = styled.span`
  font-size: 14px;
  color: black;
  margin-left: 8px;
`;

export const PasswordInput = styled(Input)`
  ${({ hasError }) =>
    hasError &&
    css`
      border-color: #ff4d4f;
      &:focus {
        border-color: #ff4d4f;
        outline: none;
      }
    `}
`;

export const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
`;
