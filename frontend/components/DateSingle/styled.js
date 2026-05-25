import styled from "styled-components";

export const DateSingleWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DateSingleOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const DateSingleFooter = styled.div`
  position: relative;
`;
