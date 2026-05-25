import styled from "styled-components";
import { styleInput } from "../styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .DateInput_input {
    width: 100% !important;
    height: 100% !important;
    border: 1px solid rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0) !important;
    padding: 0;
    padding-left: 5px !important;
    color: black !important;
    font-size: ${(props) =>
      props.fontSize ? props.fontSize : "16px"} !important;
    font-weight: 400;
    position: absolute;

    &::placeholder {
      color: rgba(100, 100, 100, 0.5) !important;
      letter-spacing: -0.4px !important;
      text-align: center;
      font-size: ${(props) =>
        props.fontSize ? props.fontSize : "16px"} !important;
    }
  }
`;

export const DateInputComponent = styled.textarea`
  ${styleInput};
  color: ${(props) => props.color};
  position: absolute;
  padding: 4px 0px 0px 0px !important;

  @media (max-width: 767px) {
    padding: 4px 0 0 0 !important;
  }
`;

export const Hint = styled.div`
  position: absolute;
  top: calc(100% + 26px);
  left: 0;
  width: 100%;
  padding: 15px 20px;
  background-color: #303030;
  text-align: center;

  p {
    display: inline-block;
    width: max-content;
    max-width: 100%;
    overflow-wrap: break-word;
    color: white;
    font-size: 14px;
    font-weight: 400;
    text-align: left;

    span {
      margin-left: 8px;
      font-size: 14px;
      font-weight: 700;
    }
  }
`;
