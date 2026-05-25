import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Tab = styled.div`
  position: relative;
  display: inline-flex;
  padding: 8px 25px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  ${(props) =>
    props.isActive
      ? css`
          color: ${gbColor.purple};

          &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: ${gbColor.purple};
          }
        `
      : css`
          color: ${gbColor.gray};
        `}
`;
