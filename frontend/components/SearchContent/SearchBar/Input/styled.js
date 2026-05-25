import styled from "styled-components";
import { gbColor } from "../../../../global/styled";
import { InputElement } from "../../../../global/styledForm";

export const Wrapper = styled.div`
  position: relative;
  width: calc(100% - 180px - 100px);
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    width: 100%;
    margin-bottom: 5px;
  }
`;

export const Search = styled.input`
  ${InputElement};

  width: 100%;
  height: 50px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.isFocus ? gbColor.systemBlue : "rgba(0, 0, 0, 0.38)"};
  background-color: ${(props) => (props.isFocus ? "white" : "#eeeff3")};
  color: black;
  font-size: 14px;
  padding: 17px 20px;
  border-radius: 0;

  @media (max-width: 767px) {
    height: 46px;
    padding: 16px 15px;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  display: inline-flex;
  top: calc(50% - 12px);
  right: 10px;
  z-index: 2;
`;
