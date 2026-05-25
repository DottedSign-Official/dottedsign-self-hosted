import styled from "styled-components";

export const Wrapper = styled.div`
  transform: translate3d(0px, 0px, 0px);
  z-index: ${(props) => (props.isFocus ? "11" : "10")};
`;

export const Back = styled.div`
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.back ? props.back : "rgba(0,0,0,.1)")};
  border-radius: ${(props) => (props.isRadio ? "100%" : "6px")};
  opacity: 0.3;

  @media (max-width: 767px) {
    border-radius: ${(props) => (props.isRadio ? "100%" : "6px")};
  }
`;

export const WrapperIcon = styled.div`
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

export const More = styled.div`
  position: absolute;
  top: -7px;
  left: -7px;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 100%;
  cursor: pointer;
  background: #ffffff;
`;
