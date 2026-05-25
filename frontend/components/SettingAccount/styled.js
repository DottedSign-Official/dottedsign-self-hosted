import styled from "styled-components";

export const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    align-items: center;
  }
`;
