import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Content = styled.div`
  width: 100%;
  padding: 0 16px;
`;

export const Title = styled.div`
  width: 100%;
  font-weight: 700;
  font-size: 16px;
  color: black;
  margin-bottom: 10px;
`;

export const Text = styled.div`
  width: 100%;
  font-size: 14px;
  margin-bottom: 25px;

  // NOTE: dropzone
  div {
    font-size: 14px !important;
    color: black;
  }
`;

export const RowButton = styled.div`
  width: 100%;
  padding: 0 0 0 50px;
  margin-top: -17px;
  margin-bottom: 25px;

  // NOTE: dropzone
  div {
    font-size: 14px !important;
  }
`;

export const Errors = styled.div`
  width: 100%;
  overflow: auto;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

export const Error = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  width: max-content;
  margin-bottom: 2px;

  &:nth-child(odd) {
    background-color: white;
  }

  &:nth-child(even) {
    background-color: ${gbColor.black12};
  }

  &:first-child {
    margin-bottom: 0;
    div {
      color: ${gbColor.deepGray};
    }
  }
`;

export const Col = styled.div`
  position: relative;
  display: inline-block;
  width: 120px;
  white-space: normal;
  overflow-wrap: break-word;
  vertical-align: top;
  padding: 8px;
  font-size: 12px;

  ${(props) =>
    props.isNull &&
    css`
      box-shadow: inset 0 0 0 1px ${gbColor.warn};
      border-radius: 3px;
    `};

  span {
    color: ${gbColor.warn};
    font-weight: 700;
  }
`;
