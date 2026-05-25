import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";

export const Box = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-width: 1px;
  border-style: solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: ${(props) => (props.isRadio ? "100%" : "4px")};

  ${(props) => {
    if (props.isRadio) {
      if (props.isReadOnly) {
        return css`
          border-color: ${gbColor.disabled};
        `;
      }
      return css`
        border-color: rgba(0, 0, 0, 0.56);
      `;
    } else if (props.isChecked) {
      if (props.isReadOnly) {
        return css`
          border-color: rgba(0, 0, 0, 0.1);
          background-color: ${gbColor.disabled};
        `;
      }
      return css`
        border-color: ${gbColor.systemBlue};
        background-color: ${gbColor.systemBlue};
        & > div {
          content: url("/static/icons/ic-checked--white.svg");
        }
      `;
    } else {
      if (props.isReadOnly) {
        return css`
          background-color: ${gbColor.disabled};
        `;
      }
      return css`
        background-color: #fff;
        border-color: ${gbColor.cancel};
      `;
    }
  }}
`;

export const RadioChecked = styled.div`
  border-radius: 100%;
  margin: 4px;
  width: calc(100% - 4px * 2);
  height: calc(100% - 4px * 2);
  background-color: ${(props) =>
    props.isReadOnly ? gbColor.disabled : gbColor.systemBlue};
`;
