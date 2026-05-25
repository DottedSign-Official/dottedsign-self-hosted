import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { btnCommon, theme } from "../../global/styledBtn";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
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

  @media (max-width: 767px) {
    padding: 8px;
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  width: 530px;
  height: 150px;
  max-width: 100%;
`;

export const WrapperUpload = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: dashed 2px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

export const Preview = styled.img`
  max-width: 100%;
  max-height: 250px;
`;

export const Panel = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
`;

export const Btn = styled.div`
  ${btnCommon};
  ${theme.primaryFlex};
  ${(props) =>
    props.isData
      ? props.isInverse
        ? css`
            color: ${gbColor.purple};
            background-color: rgba(0, 0, 0, 0);
            border: 1px solid ${gbColor.purple};
          `
        : css`
            color: white;
            background-color: ${gbColor.purple};
          `
      : css`
          color: rgba(0, 0, 0, 0.38);
          background-color: #eeeff3;
        `}
`;
