import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  margin-top: -10px;
  margin-bottom: -10px;

  touch-action: pan-x pan-y;
  overscroll-behavior: contain; /* keep scroll/zoom */
`;

export const WrapperPage = styled.div`
  position: relative;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  margin-bottom: 20px;
  background-color: white;
`;

export const WrapperLoader = styled.div`
  width: 900px;
  max-width: 100%;
  min-height: 100%;
  margin: 0 auto;
  background-color: white;
`;

export const ContainerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  transform: scale(${(props) => props.scale});
  transform-origin: 0 0;
`;
