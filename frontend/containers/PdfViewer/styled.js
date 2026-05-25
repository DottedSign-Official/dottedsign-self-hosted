import styled from "styled-components";

export const TopHolder = styled.div`
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  z-index: 10;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const WrapperHint = styled.div`
  position: relative;
  width: 100%;
`;

export const WrapperPdf = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
  padding: 50px 80px 30px;
  z-index: 1;

  @media (max-width: 1023px) {
    padding: 0 80px;
  }

  @media (max-width: 767px) {
    padding: 10px;
  }
`;

export const ToggleWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;

  height: 100%;
  padding-top: 36px;

  @media (max-width: 767px) {
    display: none;
  }
`;
