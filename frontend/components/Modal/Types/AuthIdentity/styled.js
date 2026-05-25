import styled from "styled-components";

export const Item = styled.div`
  width: 100%;
  display: ${(props) => (props.$hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: flex-start;
  padding: 8px;
  margin-bottom: 10px;

  &:not(:last-child) {
    border-bottom: 0px solid black;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const User = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Name = styled.div`
  width: calc(100% - 18px - 12px);
  padding-left: 12px;
  font-size: 14px;
  font-weight: 700;
  color: black;
  text-align: left;
  overflow-wrap: break-word;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Blank = styled.div`
  width: 0;
  height: 250px;
`;
