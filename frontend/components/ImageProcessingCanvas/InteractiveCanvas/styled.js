import styled from "styled-components";

export const Cursor = styled.div.attrs((props) => ({
  style: {
    left: `${props.left}px`,
    top: `${props.top}px`,
    width: `${props.size}px`,
    height: `${props.size}px`,
  },
}))`
  position: absolute;
  border-radius: 50%;
  border: 1px ${(props) => (props.isDashed ? "dashed" : "solid")} #000;
  outline: 1px ${(props) => (props.isDashed ? "dashed" : "solid")} #fff;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const chessboardGrid = `
 background-image: linear-gradient(45deg, #e4e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e4e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e4e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e4e0e0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

export const Wrapper = styled.div`
  ${chessboardGrid}
  position: relative;
  overflow: hidden;
  display: flex;
`;
