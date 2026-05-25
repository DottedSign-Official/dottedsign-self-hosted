import styled from "styled-components";

export const Block = `
  width: 100%;
  max-width: 900px;
  margin-right: auto;
  margin-left: auto;
`;

export const IconWrapper = styled.div`
  margin-left: auto;
`;

export const FilterWrapper = styled.div`
  margin-right: auto;
`;

export const GridWrapper = styled.div`
  ${Block}
  display: flex;
  flex-wrap: wrap;
  height: 500px;
  overflow-y: auto;
  align-content: flex-start;
`;

export const PaginationWrapper = styled.div`
  margin: 30px 0px;
`;

export const ToolWrapper = styled.div`
  ${Block}
  display: flex;
  margin-bottom: 10px;
`;
