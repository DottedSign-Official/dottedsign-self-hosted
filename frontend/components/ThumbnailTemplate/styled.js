import styled from "styled-components";

export const Content = styled.div`
  width: calc(100% - 24px);
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
`;

export const Thumbnail = styled.img`
  width: 80px;
  margin-right: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
`;

export const Name = styled.div`
  width: calc(100% - 80px - 10px);

  b {
    font-size: 16px;
    color: black;
  }

  p {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);
  }
`;
