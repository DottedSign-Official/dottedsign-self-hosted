import styled from "styled-components";
import { gbColor, styleTag } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  margin: 5px 0;
`;

export const Main = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Count = styled.div`
  width: calc(100% - 30px);
  font-size: 12px;
  color: ${gbColor.gray};
  text-decoration: underline;
  cursor: pointer;
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 250px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.38);
  border-radius: 8px;
  z-index: 3;
  cursor: default;
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 3px;
  margin: 0 0 10px;

  h3 {
    max-width: calc(100% - 30px);
    font-size: 16px;
    color: black;
    margin: 0 5px 0 0;
  }
`;

export const WrapperTooltip = styled.div`
  width: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const Tags = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

export const Tag = styled.div`
  ${styleTag};
  cursor: unset;
  background-color: ${(props) =>
    props.isGroup ? "#D9DEF9" : gbColor.lightGray};
  word-break: break-all;
  overflow-wrap: anywhere;
  min-width: 0;
  max-width: 100%;
  white-space: pre-line;
`;
