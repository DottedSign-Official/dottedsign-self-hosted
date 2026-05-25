import styled, { css } from "styled-components";
import { zIndices } from "../../global/styled";

export const ModalBack = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: ${zIndices.modalBack};
`;

export const ModalWrapper = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  ${(props) =>
    props.isInit
      ? css`
          opacity: 0;
          margin-top: 30px;
        `
      : css`
          opacity: 1;
          margin-top: 0;
        `}
`;
