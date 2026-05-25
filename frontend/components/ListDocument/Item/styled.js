import styled, { css } from "styled-components";

const styleCol = css`
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Wrapper = styled.div`
  width: calc(100%);
  display: flex;
  align-items: center;
  justify-content: space-between;

  user-select: none;
  padding: 0 16px;
`;

export const Text = styled.div`
  width: calc(100% - 48px - 24px);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Filename = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
  color: black;
`;

export const Pages = styled.div`
  max-width: 100%;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.38);
`;

export const DelIcon = styled.div`
  width: 48px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding-left: 16px;
`;

export const ColMove = styled.div`
  ${styleCol};
  width: 18px;
  margin: 0 9px;
  cursor: grab;
`;

export const DeleteCorner = styled.div`
  cursor: pointer;
  position: absolute;
  /* transform: translate(50%, -50%); */
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;

  svg {
    circle[fill="#000"] {
      fill: #d9d9d9;
    }
    path[fill="#FFF"] {
      fill: rgba(0, 0, 0, 0.38);
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ColMore = styled.div`
  ${styleCol};
  width: 18px;
  margin: 0 9px;
`;
