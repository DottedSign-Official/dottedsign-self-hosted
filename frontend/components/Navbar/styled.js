import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.nav`
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 4px 0 ${gbColor.black12};
  padding: 0 25px;

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

export const WrapperTitle = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 50%;

  @media (max-width: 1024px) {
    width: 40%;
  }

  @media (max-width: 768px) {
    width: 30%;
  }
`;

export const Title = styled.h2`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: black;
  font-size: 16px;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const WrapperMenu = styled.div`
  display: inline-flex;
  width: 50%;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 1024px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    width: 70%;
  }
`;

export const WrapperSub = styled.div`
  position: relative;
  width: auto;
  display: inline-flex;
  align-items: center;
`;

export const WrapperItem = styled.div`
  position: relative;
  margin: 0 12px;
  display: inline-flex;
  align-items: center;

  @media (max-width: 767px) {
    margin: 0 5px;
  }

  ${(props) => {
    if (props.isDesktopOnly) {
      return css`
        @media (max-width: 767px) {
          display: none;
        }
      `;
    }

    if (props.isDisabled) {
      return css`
        svg {
          opacity: 0.3;
        }
      `;
    }
  }};
`;

export const DotNotify = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${gbColor.purple};
  z-index: 2;
`;

export const WrapperTag = styled.div`
  display: inline-flex;
  margin-right: 8px;
`;

export const GuideText = styled.div`
  position: relative;
  font-size: 12px;
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.56);
  font-weight: 700;

  span {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.56);
    font-weight: 700;
  }

  @media (max-width: 560px) {
    margin-right: 15px;

    span {
      display: none;
    }
  }

  @media (max-width: 375px) {
    font-size: 10px;
    margin-right: 10px;
  }
`;
