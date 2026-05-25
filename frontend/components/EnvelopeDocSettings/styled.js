import styled from "styled-components";

const heightHeader = "60px";

export const WrapperReset = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
`;

export const WrapperCreate = styled.div`
  position: relative;
  width: 1024px;
  max-width: 100%;
  padding: 65px;
  margin-top: calc(50px + ${heightHeader});
  margin-bottom: 50px;
  background-color: white;
  border-radius: 4px;
  z-index: 2;
`;

export const WrapperSub = styled.div`
  width: 100%;
  overflow: visible;
  padding: 1px;
  margin-bottom: 56px;
`;

export const Title = styled.b`
  width: 100%;
  font-size: 20px;
  color: black;
  margin-bottom: 24px;
  display: flex;
`;

export const TipWrapper = styled.div`
  position: absolute;
  width: 100%;
  font-size: 12px;
  color: #707070;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`;

export const TipText = styled.p`
  font-size: 12px;
  margin-left: 8px;
`;
