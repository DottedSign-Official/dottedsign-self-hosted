import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 90px;
  padding: 0 40px;
  margin-bottom: 1px;
  background-color: ${(props) => (props.isFocus ? "#f9f9f9" : "white")};
  cursor: pointer;

  @media (max-width: 480px) {
    padding: 0 16px;
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const BlockName = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  width: 360px;
  margin-right: 80px;
  cursor: pointer;

  @media (max-width: 1280px) {
    width: 320px;
    margin-right: 40px;
  }
  @media (max-width: 1024px) {
    width: 190px;
    margin-right: 20px;
  }
  @media (max-width: 767px) {
    width: 100%;
    margin-right: 0;
  }
`;

const overFlow = css`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const WrapperExpire = styled.div`
  width: 100%;
  margin-bottom: 5px;
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

export const Sender = styled.div`
  ${overFlow};
  font-size: 12px;
  color: ${gbColor.gray};
  letter-spacing: 0.3px;
`;

export const BlockFlow = styled.div`
  width: calc(100% - 360px - 80px);
  display: inline-flex;

  @media (max-width: 1280px) {
    width: calc(100% - 320px - 40px);
  }
  @media (max-width: 1024px) {
    width: calc(100% - 190px - 20px);
  }
  @media (max-width: 767px) {
    display: none;
  }
`;

export const BlockMore = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 56px;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    width: 30px;
  }
`;

export const Text = styled.div`
  ${overFlow};
  font-size: 12px;
  color: ${gbColor.deepGray};
  letter-spacing: 0.3px;
  padding: 2px 0 0;
`;
