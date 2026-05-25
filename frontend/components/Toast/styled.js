import styled from "styled-components";

export const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9998;
`;

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 9999;

  -webkit-transition: bottom 0.7s;
  transition: bottom 0.7s;
  bottom: ${(props) => (props.isHide ? "-200px" : "0")};
`;

export const WrapperInner = styled.div`
  width: 288px;
  display: inline-flex;
  align-items: center;
  padding: 12px 8px 12px 16px;
  background-color: ${(props) => (props.isWarning ? "#f55f56" : "#3db45b")};
  margin-bottom: 40px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.38);
  border-radius: 4px;
`;

export const WrapperIcon = styled.div`
  display: inline-flex;
  margin-right: 16px;
`;

export const Text = styled.div`
  width: calc(100% - 24px - 16px - 16px - 24px);
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  color: white;
  font-size: 14px;

  a,
  u {
    text-decoration: underline;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0 4px;
  }
`;

export const WrapperClose = styled.div`
  display: inline-flex;
  margin-left: 16px;
  cursor: pointer;
`;
