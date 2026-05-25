import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { btnCommon } from "../../global/styledBtn";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  padding: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.38);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const WrapperInner = styled.div`
  position: relative;
  max-width: 100%;
  box-shadow: 0 2px 4px 0 rgb(74, 74, 74);
  border-radius: 5px;
  z-index: 999;
  background-color: white;
  margin-top: -10vh;

  ${(props) =>
    props.isMobile &&
    css`
      max-height: 90vh;
      margin-top: 0;
      overflow: hidden;
    `}
`;

export const Header = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-sizing: border-box;
  padding: 0 24px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
`;

export const Title = styled.div`
  font-size: 16px;
  color: black;
  font-weight: 700;
`;

export const BtnClose = styled.img`
  width: 16px;
  cursor: pointer;
`;

export const Body = styled.div`
  width: 100%;
  padding: 10px 24px;
`;

export const Content = styled.div`
  display: flex;
  color: ${gbColor.purple};
  padding: 0 8px;
  cursor: pointer;
  font-weight: normal;
`;

export const Panel = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);

  ${(props) =>
    props.isMobile &&
    props.isLandscape &&
    css`
      padding: 4px 24px;
    `}
`;

export const Plate = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-direction: row;
`;

export const PlateCircle = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px solid rgba(255, 255, 255, 0);

  ${(props) =>
    props.isActive &&
    css`
      border: 1px solid rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 0px 2px #41b6a6;
    `};

  &[data-color="blue"] {
    background-color: #0c98de;
  }
  &[data-color="red"] {
    background-color: #ff3a30;
  }
  &[data-color="white"] {
    background-color: #ffffff;
  }
  &[data-color="black"] {
    background-color: #000000;
  }
`;

export const BtnClear = styled.div`
  ${btnCommon};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  height: 32px;
  color: ${gbColor.purple};
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.07);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
