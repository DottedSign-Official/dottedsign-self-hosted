import styled, { css } from "styled-components";

export const adminColor = {
  fontBlack: "rgba(0, 0, 0, 0.9)",
  fontLight: "rgba(0, 0, 0, 0.5)",
  gray: "rgba(0, 0, 0, 0.5)",
  grayLight: "rgba(0, 0, 0, 0.1)",
};

export const adminFontSize = css`
  font-size: 16px;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Frame = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.08), 0 0 4px 0 rgba(0, 0, 0, 0.01);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
`;

export const WrapperContent = styled.div`
  width: calc(80% - 1px);
  height: 100%;
  overflow-y: auto;
`;
export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const Block = styled.div`
  position: relative;
  width: ${(props) => props.width};
  padding: 12px 35px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  ${(props) =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
    `}
`;

export const Label = styled.div`
  display: flex;
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  color: ${adminColor.fontBlack};
  margin-bottom: 10px;
`;

export const BlockContent = styled.div`
  width: 100%;
  padding: 10px 0px;
`;

export const Items = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`;

export const ItemLabel = styled.div`
  width: 40%;
  display: inline-flex;
  flex-wrap: wrap;
  ${adminFontSize};
  color: black;
  margin-right: 10px;
`;

export const ItemContent = styled.div`
  width: max-content;
  max-width: calc(60% - 10px);
  overflow-wrap: break-word;
  ${adminFontSize};
  color: ${adminColor.fontLight};
`;

export const WrapperSelect = styled.div`
  width: 300px;
`;

export const Condition = styled.div`
  width: ${(props) => props.width || "100%"};
  z-index: ${(props) => props.zIndex};
  display: inline-flex;
  padding: 10px 5px;
`;

export const WrapperLabelMenu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

export const WrapperList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${adminColor.grayLight};
  border-radius: 6px;
  margin-top: 20px;
`;

export const ListTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${adminColor.grayLight};
`;

export const ListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:nth-child(2n + 1) {
    background-color: ${adminColor.grayLight};
  }
`;

export const Col = styled.div`
  position: relative;
  display: inline-flex;
  width: ${(props) => props.len};
  ${adminFontSize};
  color: ${adminColor.fontBlack};
  padding: 20px 10px;
  ${(props) =>
    props.isTitle
      ? css`
          font-weight: 500;
          cursor: pointer;
        `
      : css`
          font-weight: 300;
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

export const Text = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${(props) =>
    props.isBold &&
    css`
      font-weight: 700;
    `}
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  align-items: center;
  transition: all 0.3s;
  ${(props) =>
    props.isAsc &&
    css`
      transform: rotate(180deg);
    `};
`;
