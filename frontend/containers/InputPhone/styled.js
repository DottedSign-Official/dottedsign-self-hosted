import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const WrapperCountries = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 120px;
  margin-right: 10px;

  @media (max-width: 767px) {
    width: 100px;
  }
`;

export const WrapperPhone = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: calc(100% - 120px - 10px);

  @media (max-width: 767px) {
    width: calc(100% - 100px - 10px);
  }
`;
