import styled from "styled-components";

export const Desc = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Text = styled.div`
  max-width: 100%;
  font-size: 14px;
  font-weight: 300;
  color: black;
  margin-bottom: 14px;
  text-align: left;

  a {
    font-size: 14px;
    font-weight: 700;
    color: black;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const Term = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
`;

export const Label = styled.div`
  max-width: calc(100% - 24px - 10px);
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.56);

  span {
    font-weight: 700;
  }
`;

export const Panel = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
  margin-bottom: -20px;
`;
