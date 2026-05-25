import styled, { css } from "styled-components";

export const WrapperMode = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: -15px;
`;

export const TabMode = styled.div`
  font-size: 16px;
  font-weight: 700;
  padding: 5px 8px;
  cursor: pointer;
  ${(props) =>
    props.isActive
      ? css`
          color: black;
          border-bottom: 4px solid #586af2;
        `
      : css`
          color: rgba(0, 0, 0, 0.56);
          border-bottom: 4px solid rgba(0, 0, 0, 0);
        `};

  &:not(:last-child) {
    margin-right: 24px;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;
