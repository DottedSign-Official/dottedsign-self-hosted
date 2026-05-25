import styled from "styled-components";

export const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
`;

export const GroupNameWrapper = styled.div`
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 3px;

  &::before {
    content: "(";
    font-size: 14px;
  }

  &::after {
    content: ")";
    font-size: 14px;
  }
`;
