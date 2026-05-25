import styled, { css } from "styled-components";

export const Content = styled.div`
  position: relative;

  ${(props) =>
    props.isMobile &&
    css`
      padding: 0 8px;
    `}
`;

export const Body = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

export const DrawArea = styled.div`
  position: relative;
  display: inline-flex;
  background-color: white;
  border-radius: 10px;
  border: solid 1px #e5e5e5;
  background-color: #f5f5f5;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: crosshair;
  z-index: 999;
`;

export const RecordCanvas = styled.canvas`
  display: none;
`;
