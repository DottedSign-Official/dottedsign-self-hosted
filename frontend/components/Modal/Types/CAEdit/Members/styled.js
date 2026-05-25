import styled from "styled-components";

export const WrapperItems = styled.div`
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
  margin: 8px 0;
  align-items: center;
`;

export const Item = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 5px;
  border-radius: 6px;
  margin: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  ${(props) => props.isCursor && "cursor: pointer;"}
`;
