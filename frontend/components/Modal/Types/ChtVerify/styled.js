import styled from "styled-components";

export const Img = styled.img`
  width: 160px;
  max-width: 90%;
  margin-top: 24px;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    width: 100px;
  }
`;

export const Text = styled.p`
  max-width: 90%;
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
