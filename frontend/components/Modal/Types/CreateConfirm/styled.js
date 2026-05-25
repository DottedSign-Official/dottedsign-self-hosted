import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px 24px;
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

export const Items = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const WrapperLabel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ItemLabelWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ChkboxText = styled.div`
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
`;

export const PFInputWrapper = styled.div`
  margin-top: 12px;
`;

export const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 220px;
  opacity: ${({ stopByDeadline }) => (stopByDeadline ? 1 : 0.5)};
  cursor: ${({ stopByDeadline }) => (stopByDeadline ? "text" : "default")};

  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

export const ResponseCountInput = styled.input`
  padding: 8px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff4d4f" : "#ddd")};
  border-radius: 4px;
  font-size: 14px;
  width: 220px;
  height: 40px;
  opacity: ${({ stopByResponseCount }) => (stopByResponseCount ? 1 : 0.5)};
  cursor: ${({ stopByResponseCount }) =>
    stopByResponseCount ? "text" : "default"};

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? "#ff4d4f" : "#1890ff")};
    box-shadow: 0 0 0 2px
      ${({ hasError }) =>
        hasError ? "rgba(255, 77, 79, 0.2)" : "rgba(24, 144, 255, 0)"};
  }
`;

export const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
`;

export const TipWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: ${gbColor.hintGray};
  margin-bottom: 24px;
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

export const WrapperValue = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  width: 40%;
`;

export const Selections = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0 0;
`;

export const Selection = styled.div`
  display: inline-flex;
  width: 50%;
  align-items: center;
`;

export const RadioLabel = styled.div`
  position: relative;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 400;

  input {
    width: 110px;
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid rgb(0, 0, 0, 0.59);
    margin-left: -10px;
  }
`;

export const Link = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${gbColor.purple};
  margin-bottom: 20px;
  cursor: pointer;
`;
