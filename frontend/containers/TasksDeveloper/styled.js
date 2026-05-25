import styled, { css } from "styled-components";

export const Block = styled.div`
  position: relative;
  width: ${(props) => props.width};
  padding: 12px 35px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  ${(props) =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
    `}
`;
export const BlockContent = styled.div`
  width: 100%;
  padding: 10px 0px;
`;

export const FilterBlock = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  z-index: 2;
`;

export const DateReportingWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const Label = styled.div`
  display: flex;
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 10px;
`;

export const TaskStatusWrapper = styled.div``;
