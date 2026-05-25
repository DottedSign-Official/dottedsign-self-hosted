import styled from "styled-components";

const chessboardGrid = `
 background-image: linear-gradient(45deg, #e4e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e4e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e4e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e4e0e0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

export const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${(props) => (props.src ? `url(${props.src})` : "none")};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export const ImageWrapper = styled.div`
  ${chessboardGrid}
  width:100%;
  height: 200px;
`;

export const Text = styled.div`
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: black;
`;
