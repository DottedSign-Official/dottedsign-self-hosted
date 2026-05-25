import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Content = styled.div`
  width: 270px;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

export const Img = styled.img`
  width: 160px;
  margin-top: 24px;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    width: 100px;
  }
`;

export const Text = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  color: black;
  font-weight: 300;
  margin-bottom: 24px;

  span {
    display: inline-block;
    font-weight: 700;
    font-size: 16px;
  }

  @media (max-width: 767px) {
    font-size: 12px;
    margin-bottom: 16px;

    span {
      font-size: 12px;
    }
  }
`;

export const OtpError = styled.div`
  width: 100%;
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;

  span {
    display: inline-block;
    max-width: 100%;
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    color: ${gbColor.warn};
  }

  @media (max-width: 767px) {
    margin-top: -10px;
  }
`;
