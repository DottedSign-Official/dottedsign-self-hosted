import styled from "styled-components";
import { HEADER_BREAKPOINT_LG } from "../../Header/styled";

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

export const WrapperBtn = styled.div`
  display: inline-flex;

  &:not(:last-child) {
    margin-right: 24px;
  }

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    width: 100%;
    margin-right: 0;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`;

export const Item = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  margin-right: 8px;

  @media (max-width: ${HEADER_BREAKPOINT_LG}px) {
    margin-right: 24px;
  }
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.isActive ? "black" : "rgba(0, 0, 0, 0.56)")};
`;
