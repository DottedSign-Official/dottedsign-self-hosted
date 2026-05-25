import styled, { css } from "styled-components";
import { gbColor } from "../../../global/styled";
import { adminColor } from "../../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin-bottom: 1px;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }

  border: 1px solid ${adminColor.grayLight};
  border-radius: 6px;
  cursor: pointer;

  margin: 5px;
  width: calc(33% - 10px);
  height: calc(25% - 10px);

  padding: 5px;
`;

const overFlow = css`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const FileName = styled.div`
  ${overFlow};
  font-size: 14px;
  color: black;
  letter-spacing: 0.4px;
  font-weight: 700;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Text = styled.div`
  ${overFlow};
  font-size: 12px;
  color: ${gbColor.deepGray};
  letter-spacing: 0.3px;
  padding: 2px 0 0;
`;

export const MoreWrapper = styled.div`
  position: absolute;
  right: 5px;
  z-index: 1000;
`;
