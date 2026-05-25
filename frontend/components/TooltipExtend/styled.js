import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: default;
`;

export const Text = styled.div`
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  color: ${(props) => props.color || gbColor.deepGray};
  font-weight: ${(props) => (props.isBold ? "500" : "400")};
  text-align: ${(props) => (props.isCenter ? "center" : "left")};
`;

const theme = {
  default: css`
    top: calc(100% + 3px);
  `,
  upward: css`
    bottom: calc(100% + 3px);
  `,
};

export const WrapperTooltip = styled.div`
  position: absolute;
  display: flex;
  justify-content: ${(props) => (props.isCenter ? "center" : "flex-start")};
  width: 100%;
  left: 0;
  ${(props) => (props.position ? theme[props.position] : theme.default)};
  z-index: 999;
`;

export const Tooltip = styled.div`
  position: relative;
  width: max-content;
  max-width: 120%;
  overflow-wrap: break-word;
  padding: 5px;
  font-size: 14px;
  background-color: ${gbColor.deepGray};
  color: white;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.1), 0 0 8px 0 rgba(0, 0, 0, 0.05);
  ${(props) => (props.position ? theme[props.position] : theme.default)};
`;
