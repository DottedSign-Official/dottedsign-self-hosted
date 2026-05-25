import styled from "styled-components";
import { mediaRule } from "../../global/styled";

export const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  min-height: 70px;
  align-items: center;
  justify-content: center;
  padding: 14px 18px;
  z-index: 999;

  @media only screen and (max-width: ${mediaRule.tablet}) {
    padding: 14px 100px;
    min-height: 80px;
  }
  @media only screen and (max-width: ${mediaRule.mobileL}) {
    padding: 14px 18px;
  }
`;

export const Text = styled.div`
  color: white;
  letter-spacing: -0.3px;
  margin: 0 20px 0 0;
  font-size: 14px;

  @media only screen and (max-width: ${mediaRule.mobileL}) {
    font-size: 12px;
  }

  a {
    margin-left: 5px;
    font-size: 14px;
    color: white;
    text-decoration: underline;

    @media (max-width: 767px) {
      font-size: 12px;
    }
  }
`;

export const Btn = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  min-width: 100px;
  border: solid 2px #ffffff;
  color: #ffffff;
  background-color: transparent;
  font-size: 14px;
  cursor: pointer;
  border-radius: 20px;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;
