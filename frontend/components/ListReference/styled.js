import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const Ref = styled.div`
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 15px;
  background-color: rgba(88, 106, 242, 0.1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  p {
    width: calc(100% - 16px);
    padding: 0 10px;
    font-size: 14px;
  }
`;
