import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
`;

export const WrapperInner = styled.div`
  display: flex;
  flex-direction: column;

  ${(props) => {
    const count = Math.floor((props.wrapperWidth + 32) / 212);
    const width = `${count * 212 - 32}px`;

    return css`
      width: ${width};
    `;
  }};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchBarContainer = styled.div`
  input {
    width: 280px;
  }

  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SearchWrapper = styled.div`
  display: flex;

  & > div {
    width: 152px;
    div {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  input {
    padding-right: 40px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  button {
    border: 0;
    background-color: transparent;
    cursor: pointer;
    margin-left: -40px;
  }
`;
