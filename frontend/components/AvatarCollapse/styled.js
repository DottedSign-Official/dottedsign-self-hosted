import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  margin: 0;
`;

export const WrapperAvatar = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  width: 230px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;

  ${(props) =>
    props.isAlignRight
      ? css`
          right: -10px;
        `
      : css`
          left: -10px;
        `};
`;

export const Item = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const Sub = styled.div`
  width: 100%;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const Name = styled.div`
  width: 100%;
  font-size: 14px;
  color: black;
  font-weight: 700;
  overflow-wrap: break-word;
`;

export const Email = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  color: black;
  overflow-wrap: break-word;
`;

const ItemBtnStyle = css`
  width: 100%;
  padding: 15px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.59);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

export const ItemBtn = styled.div`
  ${ItemBtnStyle};
`;
