import styled from "styled-components";

import { gbColor } from "../../../../../global/styled";

export const Create = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${gbColor.purple};
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 100%;
`;

export const Delete = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  background-color: ${gbColor.purple};
  border-radius: 100%;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.16), 0 0 8px 0 rgba(0, 0, 0, 0.08);
  top: 0;
  left: 0;
`;

export const WrapperColorInput = styled.div`
  width: 24px;
  height: 24px;
`;

export const ColorInput = styled.input`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export const InputCover = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.color,
  },
}))`
  width: 100%;
  height: 100%;
  border-radius: 50%;

  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid;
`;

export const WrapperItem = styled.div`
  position: relative;
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 300px;
  width: 100%;
  align-items: center;
  padding: 10px;
`;
