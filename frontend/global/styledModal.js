import styled, { css } from "styled-components";
import { gbColor, zIndices } from "./styled";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  max-height: 100%;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  height: 100%;
  width: ${(props) => (props.width ? props.width : "580px")};
`;

export const WrapperLoading = styled.div`
  width: 100%;
  padding: 50px;
`;

export const Close = styled.div`
  flex-shrink: 0;
  background-color: white;
  z-index: ${zIndices.modalCloseIcon};
  position: sticky;
  top: 0;
  align-self: flex-start;

  > div {
    position: absolute;
    top: 10px;
    left: 16px;
  }
`;

export const Title = styled.div`
  flex-shrink: 0;
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  padding: 12px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);

  background-color: white;
  z-index: ${zIndices.modalTitle};
  position: sticky;
  top: 0;
`;

export const Body = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1;
  ${(props) =>
    props.noScroll
      ? css``
      : css`
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        `};
`;

export const Content = styled.div`
  width: 100%;
  min-height: min-content;
  display: flex;
  flex-direction: column;
  padding: 16px 26px 40px;
  ${(props) =>
    props.center
      ? css`
          align-items: center;
        `
      : css`
          align-items: flex-start;
        `};
`;

export const Text = styled.div`
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: black;
  text-align: center;
`;

export const Panel = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.isSplit ? "space-between" : "flex-end")};
  align-items: center;
  padding: 24px 26px;
  border-top: solid 1px rgba(0, 0, 0, 0.12);

  @media (max-width: 767px) {
    padding: 15px 20px;
    justify-content: ${(props) => (props.isSplit ? "space-between" : "center")};
  }

  background-color: white;
  z-index: 999;
  position: sticky;
  bottom: 0;
`;

export const Hint = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
`;

export const Label = styled.p`
  width: 100%;
  color: ${gbColor.deepGray};
  font-size: 14px;
  margin-bottom: 8px;
`;
