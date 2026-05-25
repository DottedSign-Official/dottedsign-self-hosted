import styled from "styled-components";

export const Wrapper = styled.div`
  margin-left: -1px;
  width: 180px;
  z-index: 3;
  height: 50px;

  @media (max-width: 767px) {
    width: calc(100% - 100px);
    height: 46px;
  }
`;
