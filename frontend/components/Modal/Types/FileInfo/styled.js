import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const File = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 18px 25px;
  margin-bottom: 20px;
`;

export const WrapperThumbnail = styled.div`
  display: inline-flex;
  width: 62px;
  height: 88px;
  margin-right: 16px;
`;

export const Text = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100% - 62px - 16px);
`;

export const FileName = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  margin-bottom: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: black;
`;

export const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  font-size: 12px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  span {
    font-weight: 400;
    color: ${gbColor.gray};
  }
`;

export const WrapperRecords = styled.div`
  width: 100%;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 767px) {
    max-height: calc(83vh - 280px);
  }
`;

export const WrapperInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Record = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${(props) => (props.isTitle ? "5px 25px" : "15px 25px")};

  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 767px) {
    padding: ${(props) => (props.isTitle ? "5px 10px" : "10px")};
  }
`;

const colorFont = {
  gray: gbColor.gray,
  purple: gbColor.purple,
  default: "black",
};

export const Blk = styled.div`
  display: inline-block;
  width: ${(props) => props.width};
  overflow-wrap: break-word;
  padding: 3px;

  font-size: 12px;
  font-weight: ${(props) => (props.isBold ? "600" : "400")};
  color: ${(props) =>
    props.color ? colorFont[props.color] : colorFont["default"]};

  @media (max-width: 767px) {
    font-size: 10px;
  }
`;
