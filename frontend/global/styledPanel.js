import styled from "styled-components";
import { gbColor } from "./styled";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const WrapperInner = styled.div`
  width: calc(10px * 2 + 112px * 3 + 8px * 3 + 30px);
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgb(74, 74, 74);
  border-radius: 6px;
  z-index: 999;
  margin-top: -10vh;
  max-height: 70vh;

  @media (max-width: 767px) {
    width: calc(10px * 2 + 112px * 2 + 8px * 2 + 30px);
  }
`;

export const Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: 1px solid ${gbColor.black12};
  padding: 15px 10px;
`;

export const WrapperClose = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  left: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;

  @media (max-width: 767px) {
    left: 10px;
  }
`;

export const Title = styled.div`
  position: relative;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  color: black;
  text-align: center;
`;

export const WrapperApply = styled.div`
  position: absolute;
  top: calc(50% - 18px);
  right: 16px;
  display: flex;
  align-items: center;
  z-index: 2;

  @media (max-width: 767px) {
    top: calc(50% - 15px);
    right: 10px;
  }
`;

export const Body = styled.div`
  position: relative;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px 10px 8px;

  @media (max-width: 480px) {
    max-height: 250px;
  }
`;
