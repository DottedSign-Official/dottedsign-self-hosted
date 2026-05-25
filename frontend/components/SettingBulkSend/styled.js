import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
`;

export const WrapperTasks = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const Blank = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${gbColor.gray};
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;

  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

export const Block = styled.div`
  display: inline-block;
  overflow-wrap: break-word;
  font-size: 14px;
  font-weight: 400;
  width: ${(props) => (props.isDlod ? "15%" : "28.3%")};
  cursor: ${(props) =>
    props.isDlod && !props.isTitle ? "pointer" : "default"};

  ${(props) =>
    props.isTitle
      ? css`
          color: ${gbColor.gray};
          padding: 15px 10px 5px;
        `
      : css`
          color: black;
          padding: 15px 10px;
        `}
`;
