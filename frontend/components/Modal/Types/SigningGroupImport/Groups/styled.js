import styled, { css } from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Placeholder = styled.div`
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.black12};
  margin: 20px 0;
`;

export const WrapperGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px 0 20px 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isFocus ? gbColor.black12 : "unset")};

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &:hover {
    background-color: ${(props) =>
      props.isFocus ? gbColor.black12 : "rgba(0, 0, 0, 0.05)"};
  }
`;

export const Name = styled.div`
  width: calc(100% - 60px - 60px);
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.black87};
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Col = styled.div`
  width: 60px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperIcon = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 0 1px white;

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

  &:hover {
    span {
      display: flex;
    }
  }
`;

export const Tip = styled.span`
  display: none;
  position: absolute;
  bottom: calc(100% + 10px);
  right: -10px;
  background-color: ${gbColor.black87};
  padding: 10px;
  font-size: 14px;
  font-weight: 400;
  color: white;
  border-radius: 8px;
  width: max-content;
  max-width: 200px;

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: ${gbColor.black87} transparent transparent transparent;
    right: 15px;
    top: 99%;
    border-width: 5px;
  }
`;

export const WrapperLink = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  filter: grayscale(1) brightness(0);
`;
