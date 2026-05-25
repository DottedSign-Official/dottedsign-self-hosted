import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(248, 248, 248);
`;

export const WrapperIcon = styled.div`
  margin-bottom: 30px;

  img {
    width: 160px;
  }

  @media (max-width: 480px) {
    width: 40%;
    margin-bottom: 20px;

    svg,
    img {
      width: 100%;
    }
  }
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${gbColor.purple};
  margin-bottom: 16px;

  @media (max-width: 767px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const Desc = styled.div`
  width: 520px;
  max-width: 90%;
  font-size: 18px;
  font-weight: 400;
  color: rgb(100, 100, 100);
  text-align: center;
  margin-bottom: 20px;

  a,
  u {
    color: ${gbColor.purple};
    cursor: pointer;
    margin: 0 5px;
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

export const Email = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  p {
    max-width: calc(100% - 24px - 8px);
    margin-left: 8px;
    font-size: 14px;
    color: black;

    @media (max-width: 767px) {
      font-size: 12px;
    }
  }
`;

export const Panel = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
`;
