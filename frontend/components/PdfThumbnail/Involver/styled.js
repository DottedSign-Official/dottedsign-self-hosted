import styled, { css } from "styled-components";
import { orderColor } from "../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.12), 0 0 8px 0 rgba(0, 0, 0, 0.06);
  margin-left: -5px;
  cursor: default;

  ${(props) =>
    props.user.icon
      ? css`
          background-image: url(${props.user.icon});
          background-size: cover;
          background-position: center;
          border: 2px solid ${orderColor[props.user.order - 1]};
        `
      : css`
          background-color: ${orderColor[props.user.order - 1]};
          border: 2px solid white;
        `};
`;

export const ToolTip = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  width: max-content;
  max-width: 120px;
  overflow-wrap: break-word;
`;

export const Text = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: white;
`;
