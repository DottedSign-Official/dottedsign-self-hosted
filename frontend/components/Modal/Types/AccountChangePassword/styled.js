import styled from "styled-components";

export const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 34px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 50px;
  }
`;

export const Label = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.56);
  font-weight: 500;
  margin-bottom: 8px;
`;
