import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  margin-bottom: 16px;
`;

export const Icon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 14px;
  margin-right: 10px;

  ${(props) =>
    props.isActive &&
    css`
      border: 1px solid rgba(0, 0, 0, 0);
      background-color: ${gbColor.purple};

      &:before {
        content: "✓";
      }
    `};
`;

export const Text = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.56);
`;
