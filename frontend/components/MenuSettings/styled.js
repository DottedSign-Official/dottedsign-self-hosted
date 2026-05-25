import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 240px;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  padding-left: 20px;
`;

export const BtnCont = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;

  ${(props) =>
    props.isActive &&
    css`
      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 5px;
        height: 100%;
        background-color: ${gbColor.purple};
      }
    `};
`;

export const Tab = styled.div`
  width: calc(80% - 30px);
  padding: 12px 25px 12px 8px;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => (props.isActive ? "black" : "rgba(0, 0, 0, 0.38)")};
  cursor: pointer;
  text-align: left;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;
