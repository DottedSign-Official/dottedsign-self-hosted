import styled, { css } from "styled-components";
import { Divider, gbColor } from "../../../../global/styled";

export const Content = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  canvas {
    width: 100%;
  }
`;

export const File = styled.div`
  position: relative;
  flex-grow: 1;
  padding: 10px 15px;
  background-color: rgba(88, 106, 242, 0.1);
  border-radius: 3px;

  :hover {
    z-index: 1;
  }

  ${({ isHighLight }) =>
    isHighLight &&
    css`
      border: 1.5px solid ${gbColor.highlight_green};
      background-color: ${gbColor.highlight_yellow};
    `}
`;

export const AttachmentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const TskName = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 8px 0 0;

  color: ${({ focus }) => (focus ? "rgb(63, 63, 63)" : "rgb(124, 124, 124);")};
  font-weight: ${({ focus }) => focus && "600"};
`;

export const AttaDivider = styled(Divider)`
  width: 100%;
  background-color: #80808050;
  margin: 2px 0 8px;

  background-color: ${({ focus }) => focus && "#80808090"};
  height: ${({ focus }) => focus && "1px"};
`;
