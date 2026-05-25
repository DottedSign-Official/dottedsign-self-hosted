import styled from "styled-components";

export const HEADER_BREAKPOINT_LG = 1240;

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  z-index: 11;
`;

export const WrapperInner = styled.div`
  width: 95%;
  position: relative;

  height: 60px;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    width: 95%;
  }
`;

export const WrapperLogo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: inline-flex;
  align-items: center;

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    position: relative;
    left: auto;
  }
`;

export const Logo = styled.div`
  width: 150px;
  height: 44px;
  background-size: 100% 100%;
  background-image: url("/static/images/jackrabbit-ds.png");
`;

export const WrapperPanel = styled.div`
  position: relative;
  display: inline-flex;

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    position: absolute;
    left: 10px;
    top: 0;
    height: 100%;
    align-items: center;
  }
`;

export const WrapperAux = styled.div`
  position: absolute;
  right: 10px;
  height: 100%;
  display: inline-flex;
  align-items: center;
`;
