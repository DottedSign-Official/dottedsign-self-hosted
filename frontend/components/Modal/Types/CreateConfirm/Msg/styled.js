import styled, { css } from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Tabs = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  z-index: 2;
`;

export const Tab = styled.div`
  padding: 10px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;

  ${(props) =>
    props.isFocus
      ? css`
          border: 1px solid rgba(0, 0, 0, 0.87);
          background-color: rgba(0, 0, 0, 0.87);
          color: white;
        `
      : css`
          border: 1px solid rgba(0, 0, 0, 0.12);
          background-color: white;
          color: rgba(0, 0, 0, 0.87);
        `}

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

export const Body = styled.div`
  width: 100%;
  padding: 40px 20px 20px;
  margin-top: -40px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${gbColor.black12};
  border-radius: 8px;
`;

export const Label = styled.div`
  width: 100%;
  color: ${gbColor.black87};
  font-weight: 400;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;
