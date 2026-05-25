import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

export const WrapperAvatar = styled.div`
  width: 32px;
  margin-right: 10px;
  display: inline-flex;
  justify-content: center;
`;

export const Name = styled.div`
  width: calc(100% - 32px - 10px);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Tag = styled.div`
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: "black";

  @media (max-width: 767px) {
    font-size: 10px;
  }
`;

export const Email = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  text-align: left;
  color: black;
  font-size: 12px;

  @media (max-width: 767px) {
    font-size: 6px;
  }
`;
