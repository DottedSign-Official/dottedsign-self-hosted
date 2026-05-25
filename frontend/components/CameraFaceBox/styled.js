import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

export const CameraContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  width: 230px;
  height: 192px;
  border-radius: 20px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 9999;
  background: #000;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* NOTE: mirror camera */
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: 8px;
`;

export const Message = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  line-height: normal;
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
