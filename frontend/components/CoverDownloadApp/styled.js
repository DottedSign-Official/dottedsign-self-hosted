import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("/static/images/waveform-01.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  padding: 18px 24px 0;

  @media (max-width: 375px) {
    padding: 18px 18px 0;
  }
`;

export const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;

  @media (max-width: 375px) {
    margin-bottom: 40px;
  }
`;

export const Title = styled.h1`
  width: 540px;
  max-width: 100%;
  font-size: 40px;
  color: black;
  text-align: center;
  margin: 0;
  margin-bottom: 24px;

  @media (max-width: 375px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const Desc = styled.div`
  width: 420px;
  max-width: 100%;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.56);
  font-weight: 400;
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 375px) {
    font-size: 12px;
    margin-bottom: 20px;
  }
`;

export const Panel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Divider = styled.div`
  width: 100%;
  height: 30px;
`;

export const Illustrate = styled.img`
  width: 100%;

  @media (max-width: 375px) {
    width: calc(100% + 18px * 2);
    margin-left: -18px;
  }
`;
