import styled, { css } from "styled-components";
import { gbColor, gbParam } from "../../../../global/styled";

export const Block = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 25px;
  }
`;

export const Label = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  span {
    margin-left: 8px;
  }
`;

export const Blank = styled.div`
  width: 100%;
  height: 180px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
`;

export const ChkboxHint = styled.div`
  width: calc(100% - 30px - 8px);
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
`;

export const Error = styled.p`
  width: 100%;
  padding: 8px 0;
  color: ${gbColor.warn};
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  word-break: break-word;
`;

export const WrapCollapse = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
    `}
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px 30px;
`;

export const Items = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperLabel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ChkboxLabel = styled.div`
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: 60%;
  overflow-wrap: break-word;
  font-size: 14px;
  color: black;
  font-weight: 500;
  padding-right: 8px;

  span {
    margin-left: 8px;
  }
`;

export const Selections = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0 0;
`;

export const Selection = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
`;

export const WrapperTips = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;

  p {
    margin-left: 12px;
  }
`;

export const LabelPro = styled.div`
  display: flex;
  align-items: center;
  gap: ${gbParam.iconText};
`;

export const QuantityTips = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

export const TipsText = styled.p`
  color: ${gbColor.deepGray};
  font-size: 14px;
`;
