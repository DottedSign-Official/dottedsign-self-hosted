import styled, { css } from "styled-components";
import { orderColor, readOnlyColor, zIndices } from "../../../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  opacity: 1 !important;
  z-index: ${(props) =>
    props.isGroupHolder ? zIndices.groupHolder : zIndices.holder};
`;

export const WrapperContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: none !important;
  cursor: pointer;
`;

export const WrapperRequired = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  max-width: 30%;
  max-height: 40%;
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const Block = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) =>
      props.indx !== -1
        ? props.readOnly
          ? readOnlyColor
          : orderColor[props.indx]
        : "transparent"};
    opacity: 0.3;
    border: ${(props) => (props.isRequiredBorder ? "1px solid red" : "none")};

    ${(props) =>
      props.isRadio &&
      css`
        border-radius: 100%;
      `};
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
  }
`;
