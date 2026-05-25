import styled from "styled-components";

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

export const Order = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  p {
    width: calc(100% - 24px - 8px);
    margin-left: 8px;
    font-size: 14px;
  }
`;
