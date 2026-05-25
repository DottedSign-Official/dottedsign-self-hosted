import styled from "styled-components";

export const Menu = styled.div`
  position: absolute;
  z-index: 99;
  transform: translate(-100%, 0px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.12) 1px 1px 10px;
  z-index: 0;
  border-radius: 6px;
  display: none;
`;

export const MenuItem = styled.div`
  width: 100%;
  padding: 12px 8px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  :first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  :last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  white-space: nowrap;
`;

export const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  &:focus-within {
    background-color: rgba(0, 0, 0, 0.12);

    ${Menu} {
      display: block;
    }
  }
`;
