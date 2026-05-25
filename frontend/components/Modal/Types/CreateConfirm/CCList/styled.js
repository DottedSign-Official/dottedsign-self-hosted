import styled, { css } from "styled-components";

export const WrapperList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 10px 0;
  margin-bottom: 16px;

  background-color: white;
  -moz-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const styleCol = css`
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ColTagNumber = styled.div`
  ${styleCol};
  width: 50px;
`;

export const ColName = styled.div`
  ${styleCol};
  width: 190px;
  margin-right: 16px;
  flex: 1;
`;

export const ColEmail = styled.div`
  ${styleCol};
  flex: 2;
  margin-right: 12px;
`;
