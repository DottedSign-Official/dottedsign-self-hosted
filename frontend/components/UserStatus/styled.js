import styled from "styled-components";

export const Status = styled.div`
  display: inline-flex;
  max-width: 100%;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.color ? props.color : "black")};
  text-align: left;
`;
