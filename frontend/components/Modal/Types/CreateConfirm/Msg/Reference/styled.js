import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const Item = styled.div`
  width: 100%;
  padding: 10px 15px;
  background-color: rgba(88, 106, 242, 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
`;

export const Name = styled.div`
  width: calc(100% - 28px * 2);
  padding: 0 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
`;

export const WrapperDel = styled.div`
  width: 24px;
  cursor: pointer;
`;

export const WrapperUpload = styled.div`
  width: auto;

  div {
    font-size: 12px;
  }
`;
