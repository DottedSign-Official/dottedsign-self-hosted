import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 288px;
  max-width: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
  margin: 8px;
  border-radius: 10px;

  @media (max-width: 767px) {
    margin: 0 8px 20px;
  }
`;

export const Title = styled.div`
  position: relative;
  width: 100%;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgb(230, 230, 230);
  cursor: pointer;
`;

export const WrapperPreview = styled.div`
  display: inline-flex;
  width: 50px;
  height: 70px;
  margin-right: 8px;
`;

export const WrapperText = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: calc(100% - 100px);

  @media (max-width: 767px) {
    width: calc(100% - 50px - 10px);
  }
`;

export const Filename = styled.div`
  width: 100%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  color: black;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const Time = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${gbColor.gray};
`;

export const WrapperExpire = styled.div`
  position: absolute;
  top: 10px;
  left: calc(16px + 50px + 8px);
  width: calc(100% - 16px * 2 - 50px - 8px - 24px - 8px);
  z-index: 2;
`;

export const WrapperMore = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const WrapperEnvelopeIcon = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;

  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
