import styled, { css } from "styled-components";
import { gbColor } from "../../../../global/styled";
import { STAGE_TYPES } from "../../../../constants/constants";

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

export const Order = styled.p`
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const Name = styled.h3`
  width: 100%;
  word-break: break-all;
  font-size: 16px;
  color: ${gbColor.black87};
  margin: 0 0 12px;
`;

export const Desc = styled.p`
  width: 100%;
  word-break: break-all;
  font-size: 16px;
  color: ${gbColor.black87};
  margin: 0;
`;

export const Signers = styled.div`
  width: calc(100% + 26px * 2);
  margin-left: -26px;
  display: flex;
  flex-direction: column;
`;

export const Signer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 26px;

  &:nth-child(2n) {
    background-color: white;
  }
  &:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  ${(props) =>
    props.isOrder &&
    css`
      &:before {
        content: "";
        width: 6px;
        height: 100%;
        position: absolute;
        left: 32px;
        top: 0;
        background-color: ${gbColor.purple};
      }
      &:first-child {
        &:before {
          content: "";
          width: 6px;
          height: 50%;
          position: absolute;
          left: 32px;
          top: 50%;
          background-color: ${gbColor.purple};
        }
      }
      &:last-child {
        &:before {
          content: "";
          width: 6px;
          height: 50%;
          position: absolute;
          left: 32px;
          top: 0;
          background-color: ${gbColor.purple};
        }
      }
      &:first-child:last-child {
        &:before {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    `};
`;

export const WrapperTag = styled.div`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  width: 50px;
`;

export const RecipientContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: calc(100% - 50px - 50px);
  padding-right: 10px;

  h3 {
    width: 100%;
    font-size: 12px;
    font-weight: 700;
    margin: 0 0 6px;
  }

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 700;
    color: black;
    margin: 0;
  }
`;

export const WrapperMore = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
`;

const TextOverflowEllipsis = `
  display: inline-block;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RecipientType = styled.h3`
  color: ${(props) =>
    props.stageType === STAGE_TYPES.edit
      ? gbColor.systemBlue
      : "rgba(0, 0, 0, 0.56)"};
`;

export const ReceiverInfo = styled.p`
  ${TextOverflowEllipsis}
`;
