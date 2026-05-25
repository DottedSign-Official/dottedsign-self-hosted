import styled, { css } from "styled-components";
import { orderColor } from "../../global/styled";

export const FieldGroupItem = styled.div`
  &:before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    border-radius: 6px;
    background-color: ${(props) =>
      typeof props.order === "number"
        ? orderColor[props.order % 8]
        : "rgba(0,0,0,.1)"};
    opacity: ${(props) => {
      if (props.isHide) {
        return 0;
      }
      return props.isEditable ? 0.1 : 0.05;
    }};
  }

  ${(props) => {
    if (props.isRequired && !props.isHide) {
      return css`
        &:after {
          content: "";
          position: absolute;
          background: url("../../static/icons/ic-asterisk.svg");
          background-size: cover;
          background-position: center;
          top: -10px;
          right: -10px;
          width: 14px;
          height: 14px;
        }
      `;
    }
  }};
`;
