import styled from "styled-components";

export const Content = styled.div`
  width: 100%;
  min-height: min-content;
  display: flex;
  flex-direction: row;
  padding: 16px 26px 40px;
  align-items: center;
  align-content: space-between;
  gap: 10px;
  @media (max-width: 767px) {
    padding: 10px 20px;
  }
`;
