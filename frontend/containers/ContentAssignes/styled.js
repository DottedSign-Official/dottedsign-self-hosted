import styled from "styled-components";

export const WrapperTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => (props.isUpward ? "-36px" : "uset")};
`;
