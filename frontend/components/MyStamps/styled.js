import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const Item = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin: 0 8px 16px;
`;

export const StampWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 112px;
  height: 112px;
  padding: 8px;
  border-radius: 5px;
  border: ${(props) =>
    props.isActive ? `1px solid ${gbColor.systemBlue}` : "1px solid #bcbcbc"};

  ${(props) =>
    props.isActive &&
    css`
      background-color: ${gbColor.activeBack};
    `}
`;

export const Stamp = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export const Del = styled.div`
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -10px;
  left: -10px;
  width: 24px;
  height: 24px;
  background-color: ${gbColor.purple};
  border-radius: 100%;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.16), 0 0 8px 0 rgba(0, 0, 0, 0.08);
`;

export const UploadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #586af2;
  text-align: center;
`;
