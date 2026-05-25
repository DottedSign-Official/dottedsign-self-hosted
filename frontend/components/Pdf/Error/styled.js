import styled from "styled-components";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  min-height: 80vh;
  padding: 20px;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto;
`;

export const Img = styled.img`
  width: 120px;
  margin-bottom: 50px;
  opacity: 0.8;

  @media (max-width: 767px) {
    width: 80px;
    margin-bottom: 30px;
  }
`;

export const Title = styled.b`
  width: 100%;
  font-size: 24px;
  color: ${gbColor.deepGray};
  margin-bottom: 10px;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

export const Desc = styled.p`
  width: 100%;
  word-wrap: break-word;
  font-size: 18px;
  color: ${gbColor.deepGray};

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Panel = styled.div`
  width: 100%;
  margin: 50px 0 20px;
  display: flex;
  justify-content: flex-start;
`;

export const Badge = styled.a`
  background-color: ${gbColor.purple};
  color: white;
  border-radius: 8px;
  font-size: 16px;
  padding: 12px 16px;

  @media (max-width: 767px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;
