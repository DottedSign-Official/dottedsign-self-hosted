import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 30px;
`;

export const WrapperBtnTask = styled.div`
  position: absolute;
  right: -5px;
  top: -24px;
  display: flex;
  z-index: 10;

  @media (max-width: 767px) {
    position: fixed;
    top: auto;
    bottom: 24px;
    right: 24px;
  }
`;

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  z-index: 2;
`;

export const ToolbarSub = styled.div`
  width: 50%;
  min-height: 40px;
  display: inline-flex;
  justify-content: ${(props) => (props.isRight ? "flex-end" : "flex-start")};
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1;

  @media (max-width: 767px) {
    padding: 0 0 25px;
  }
`;

export const TaskWrapper = styled.div`
  width: 100%;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
