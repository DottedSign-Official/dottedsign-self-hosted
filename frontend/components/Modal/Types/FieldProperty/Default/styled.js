import styled from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const DateWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const DateInput = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid ${gbColor.lightGray};
`;

export const DateClear = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${gbColor.purple};
  cursor: pointer;
`;

export const SignWrapper = styled.div`
  width: 100%;
`;

export const SignContent = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  p {
    color: rgba(0, 0, 0, 0.1);
  }
`;

export const SignPreview = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export const SignClear = styled.div`
  float: right;
  cursor: pointer;
  color: ${gbColor.warn};
  font-size: 12px;
  font-weight: 300;
`;

export const LinkWrapper = styled.div`
  width: 100%;
`;
