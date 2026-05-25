import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import formStatus from "./data";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const WrapperBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const WrapperList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

export const Block = styled.div`
  position: relative;
  display: inline-block;
  align-items: center;
  padding: 15px 10px;
  font-size: 14px;
  color: black;
  font-weight: ${(props) => (props.isBold ? "600" : "400")};
  text-transform: ${(props) => (props.isUppercase ? "uppercase" : "normal")};

  ${(props) => {
    if (props.isTitle) {
      return css`
        color: ${gbColor.gray};
        padding: 15px 10px 5px;
        display: inline-flex;
      `;
    }

    if (props.isStatus) {
      const commonStyle = css`
        font-size: 12px;
        font-weight: 500;
        color: ${gbColor.black87};
      `;

      if (props.status === formStatus.publish) {
        return css`
          ${commonStyle};
          color: ${gbColor.purple};
        `;
      }

      if (props.status === formStatus.completed) {
        return css`
          ${commonStyle};
        `;
      }

      if (props.status === formStatus.unpublish) {
        return css`
          ${commonStyle};
          opacity: 0.5;
        `;
      }

      return css`
        ${commonStyle};
        opacity: 0.2;
      `;
    }
  }};

  &:first-child {
    width: calc(100% - 510px);
  }
  &:nth-child(2) {
    width: 220px;
  }
  &:nth-child(3) {
    width: 100px;
  }
  &:nth-child(4) {
    width: 140px;
  }
  &:nth-child(5) {
    width: 40px;
  }

  @media (max-width: 920px) {
    &:first-child {
      width: calc(100% - 280px);
    }
    &:nth-child(2) {
      display: none;
    }
  }

  @media (max-width: 767px) {
    font-size: 12px;

    &:first-child {
      width: calc(100% - 180px);
    }
    &:nth-child(3) {
      width: 70px;
    }
    &:nth-child(4) {
      width: 80px;
    }
    &:nth-child(5) {
      width: 30px;
    }
  }
`;

export const Blank = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${gbColor.gray};
`;
