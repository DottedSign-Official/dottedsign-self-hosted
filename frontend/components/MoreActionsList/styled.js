import styled, { css } from "styled-components";
import {
  adminColor,
  adminFontSize,
  Block,
  Label,
  Item,
} from "../../global/styledAdmin";
import { gbColor } from "../../global/styled";
import { InputElement } from "../../global/styledForm";

export const ActivatableItem = styled(Item)`
  font-weight: ${(props) => (props.selected ? "bold" : "unset")};
  cursor: pointer;
`;

export const AutoGrowBlock = styled(Block)`
  flex-grow: 1;
  width: 100%;
`;

export const Title = styled(Label)`
  margin: 0.5em 0 1em 0;
  align-items: center;
  gap: 5px;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;

  ${({ cols }) =>
    cols?.map(
      (col, index) =>
        css`
          & ${ListItem} ${Col}:nth-child(${index + 1}) {
            width: ${col.width};
            flex-grow: ${col.autoGrow ? 1 : 0};
          }
        `,
    )}
`;

export const ListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.03);
  }

  word-break: break-word;
  overflow-wrap: break-word;
`;

export const Col = styled.div`
  display: inline-block;
  flex-basis: ${({ width }) => (width ? width : "auto")};
  ${adminFontSize};
  padding: 10px 10px;

  ${({ isTitle }) =>
    isTitle
      ? css`
          color: ${gbColor.gray};
          font-size: 14px;
          font-weight: 500;
          padding: 15px 5px 5px;
        `
      : css`
          color: ${adminColor.fontBlack};
          font-weight: 300;
          padding: 15px 10px;
        `};

  justify-content: ${({ align }) => {
    switch (align?.toLowerCase()) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  }};
`;

export const Conditions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Blank = styled.div`
  width: 100%;
  padding: 30px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${gbColor.gray};
`;

export const Search = styled.input`
  ${InputElement};
  width: 230px;
  padding: 11px 16px;
  border-color: rgba(0, 0, 0, 0.2);

  &:read-only {
    background-color: #ececec;
    border-color: ${gbColor.disabled};
  }

  @media (max-width: 767px) {
    display: none;
  }
`;
