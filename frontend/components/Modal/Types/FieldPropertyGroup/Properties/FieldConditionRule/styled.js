import styled from "styled-components";
import { color, gbColor } from "../../../../../../global/styled";

export const RuleSettingWrapper = styled.div`
  background-color: #f3f4f7;
  border-radius: 4px;
  padding: 16px;
  font-size: 14px;
  border: ${(props) => (props.isError ? `1px solid ${gbColor.warn}` : "none")};
`;

export const ControlPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const IconWrapper = styled.div`
  width: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const VerticalDivider = styled.div`
  margin: 0 16px 0 20px;
  width: 1px;
  height: 24px;
  background-color: #aaaaaa;
`;

export const SelectedItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding: 8px 0;
`;

export const SelectedItem = styled.div`
  display: block;
  background-color: #a4a4a461;
  border-radius: 4px;
  padding: 4px 6px;
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const AddRuleButton = styled.div`
  cursor: pointer;
  width: auto;
  color: ${color.primary};
  font-size: 14px;
  font-weight: 700;
`;

export const RuleText = styled.div`
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;

  span {
    font-weight: 700;
  }
`;
