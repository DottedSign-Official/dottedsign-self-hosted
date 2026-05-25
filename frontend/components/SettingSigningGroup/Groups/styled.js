import styled, { css } from "styled-components";
import { gbColor } from "../../../global/styled";

export const Placeholder = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.gray};
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Group = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;

  &:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:nth-child(2n) {
    background-color: white;
  }
`;

export const Name = styled.p`
  width: calc(100% - 80px - 24px);
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: black;
  padding-right: 12px;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Share = styled.div`
  width: 80px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
`;

export const WrapperIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  box-shadow: inset 0 0 0 1px white;
  border-radius: 100%;

  ${(props) =>
    props.isShared
      ? css`
          background-color: ${gbColor.purple};
          border: 1px solid ${gbColor.purple};
        `
      : css`
          background-color: rgb(100, 100, 100);
          border: 1px solid rgb(100, 100, 100);
        `};
`;

export const WrapperMore = styled.div`
  width: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
