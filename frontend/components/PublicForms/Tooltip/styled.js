import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  max-width: 100%;
  width: 100%;
  display: inline-flex;
  align-items: flex-start;
`;

export const Name = styled.p`
  position: relative;
  max-width: calc(100% - 4px - 16px);
  flex: 1;
  cursor: default;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Template = styled.div`
  position: relative;
  width: 16px;
  margin-left: 4px;
  display: inline-flex;
  justify-items: center;
  align-items: center;
  cursor: default;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    div:last-child {
      display: flex;
    }
  }
`;

export const Popup = styled.div`
  display: none;
  position: absolute;
  top: 36px;
  left: -11px;
  padding: 10px;
  border-radius: 5px;
  background-color: #4a4a4a;
  color: white;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 2;

  &:before {
    content: "";
    position: absolute;
    top: -10px;
    left: 12px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 9.5px 11px 9.5px;
    border-color: transparent transparent #4a4a4a transparent;
  }
`;
