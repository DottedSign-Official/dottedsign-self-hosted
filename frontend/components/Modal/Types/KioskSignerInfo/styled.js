import styled from "styled-components";

export const Desc = styled.p`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 30px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input:read-only {
    border: 1px solid rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 700;
  width: 100%;
  margin-bottom: 8px;
`;
